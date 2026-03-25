-- =====================================================
-- Quick Blood Database Schema (v2.0 - Full MVP)
-- SQL Server (Azure SQL / Azure Data Studio)
-- =====================================================

-- =====================================================
-- SECTION 1 — CORE IDENTITY & AUTH
-- =====================================================

-- 1.1 USERS
CREATE TABLE Users (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name            NVARCHAR(100)   NOT NULL,
    Email           NVARCHAR(150)   UNIQUE NOT NULL,
    Phone           NVARCHAR(15)    UNIQUE NOT NULL,
    PasswordHash    NVARCHAR(255)   NOT NULL,
    Role            NVARCHAR(20)    NOT NULL CHECK (Role IN ('Donor','Patient','Hospital','Admin')),
    IsEmailVerified BIT             DEFAULT 0,
    IsPhoneVerified BIT             DEFAULT 0,
    IsActive        BIT             DEFAULT 1,
    CreatedAt       DATETIME        DEFAULT GETDATE(),
    UpdatedAt       DATETIME        DEFAULT GETDATE()
);

-- 1.2 OTP VERIFICATIONS (email + phone, reusable for both)
CREATE TABLE OtpVerifications (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    Type        NVARCHAR(10)     NOT NULL CHECK (Type IN ('Email','Phone')),
    Code        NVARCHAR(10)     NOT NULL,
    ExpiresAt   DATETIME         NOT NULL,
    IsUsed      BIT              DEFAULT 0,
    CreatedAt   DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 1.3 PASSWORD RESET TOKENS
CREATE TABLE PasswordResetTokens (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    Token       NVARCHAR(255)    NOT NULL UNIQUE,
    ExpiresAt   DATETIME         NOT NULL,
    IsUsed      BIT              DEFAULT 0,
    CreatedAt   DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 1.4 USER SESSIONS (for server-side session invalidation / multi-device)
CREATE TABLE UserSessions (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    TokenHash   NVARCHAR(255)    NOT NULL,
    DeviceInfo  NVARCHAR(255)    NULL,
    IpAddress   NVARCHAR(50)     NULL,
    ExpiresAt   DATETIME         NOT NULL,
    RevokedAt   DATETIME         NULL,
    CreatedAt   DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);


-- =====================================================
-- SECTION 2 — ROLE PROFILES
-- =====================================================

-- 2.1 DONOR PROFILES
CREATE TABLE DonorProfiles (
    Id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId              UNIQUEIDENTIFIER UNIQUE NOT NULL,
    BloodGroup          NVARCHAR(5)      NOT NULL,
    IsAvailable         BIT              DEFAULT 1,
    City                NVARCHAR(100)    NULL,
    State               NVARCHAR(100)    NULL,
    Pincode             NVARCHAR(10)     NULL,
    Latitude            FLOAT            NULL,
    Longitude           FLOAT            NULL,
    LastDonationDate    DATE             NULL,
    TotalDonations      INT              DEFAULT 0,
    ReliabilityScore    INT              DEFAULT 0 CHECK (ReliabilityScore BETWEEN 0 AND 100),
    AvatarUrl           NVARCHAR(500)    NULL,
    CreatedAt           DATETIME         DEFAULT GETDATE(),
    UpdatedAt           DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 2.2 PATIENT PROFILES
CREATE TABLE PatientProfiles (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId          UNIQUEIDENTIFIER UNIQUE NOT NULL,
    BloodGroup      NVARCHAR(5)      NULL,
    City            NVARCHAR(100)    NULL,
    State           NVARCHAR(100)    NULL,
    AvatarUrl       NVARCHAR(500)    NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    UpdatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 2.3 HOSPITAL PROFILES
CREATE TABLE HospitalProfiles (
    Id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId              UNIQUEIDENTIFIER UNIQUE NOT NULL,
    HospitalName        NVARCHAR(200)    NOT NULL,
    HospitalType        NVARCHAR(50)     NULL,  -- Private / Government / Trust
    LicenseNumber       NVARCHAR(100)    NULL,
    Address             NVARCHAR(255)    NULL,
    City                NVARCHAR(100)    NULL,
    State               NVARCHAR(100)    NULL,
    Pincode             NVARCHAR(10)     NULL,
    Latitude            FLOAT            NULL,
    Longitude           FLOAT            NULL,
    Phone               NVARCHAR(15)     NULL,
    EmergencyContact    NVARCHAR(15)     NULL,
    Website             NVARCHAR(255)    NULL,
    HasBloodBank        BIT              DEFAULT 0,
    IsNabh              BIT              DEFAULT 0,
    TotalBeds           INT              NULL,
    ManagerName         NVARCHAR(100)    NULL,
    ManagerPhone        NVARCHAR(15)     NULL,
    ManagerEmail        NVARCHAR(150)    NULL,
    IsVerified          BIT              DEFAULT 0,
    VerifiedAt          DATETIME         NULL,
    VerifiedByAdminId   UNIQUEIDENTIFIER NULL,
    CreatedAt           DATETIME         DEFAULT GETDATE(),
    UpdatedAt           DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId)             REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (VerifiedByAdminId)  REFERENCES Users(Id)
);

-- 2.4 HOSPITAL VERIFICATION DOCUMENTS
CREATE TABLE HospitalDocuments (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    HospitalId      UNIQUEIDENTIFIER NOT NULL,
    DocumentType    NVARCHAR(100)    NOT NULL,  -- e.g. 'License', 'NABH Certificate'
    FileUrl         NVARCHAR(500)    NOT NULL,
    UploadedAt      DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (HospitalId) REFERENCES HospitalProfiles(Id) ON DELETE CASCADE
);


-- =====================================================
-- SECTION 3 — BLOOD REQUESTS
-- =====================================================

-- 3.1 BLOOD REQUESTS
CREATE TABLE BloodRequests (
    Id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CreatedByUserId     UNIQUEIDENTIFIER NOT NULL,
    SourceType          NVARCHAR(10)     NOT NULL CHECK (SourceType IN ('Patient','Hospital')),
    PatientName         NVARCHAR(100)    NOT NULL,
    PatientAge          INT              NULL,
    BloodGroup          NVARCHAR(5)      NOT NULL,
    UnitsRequired       INT              NOT NULL CHECK (UnitsRequired > 0),
    Urgency             NVARCHAR(20)     NOT NULL CHECK (Urgency IN ('Urgent','Scheduled','Regular')),
    Status              NVARCHAR(20)     NOT NULL DEFAULT 'Open'
                            CHECK (Status IN ('Open','Matched','Fulfilled','Cancelled')),
    HospitalId          UNIQUEIDENTIFIER NULL,
    HospitalName        NVARCHAR(200)    NULL,  -- denormalised for quick display
    Area                NVARCHAR(100)    NULL,
    City                NVARCHAR(100)    NULL,
    Latitude            FLOAT            NULL,
    Longitude           FLOAT            NULL,
    DoctorName          NVARCHAR(100)    NULL,
    Ward                NVARCHAR(100)    NULL,
    BedNumber           NVARCHAR(20)     NULL,
    CrossmatchRequired  BIT              DEFAULT 0,
    ClinicalNotes       NVARCHAR(1000)   NULL,
    ScheduledDate       DATE             NULL,  -- for Scheduled urgency
    FulfilledAt         DATETIME         NULL,
    CancelledAt         DATETIME         NULL,
    CancelReason        NVARCHAR(500)    NULL,
    CreatedAt           DATETIME         DEFAULT GETDATE(),
    UpdatedAt           DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
    FOREIGN KEY (HospitalId)      REFERENCES HospitalProfiles(Id)
);

-- 3.2 REQUEST RESPONSES (Donor willingness → confirmed)
CREATE TABLE RequestResponses (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequestId       UNIQUEIDENTIFIER NOT NULL,
    DonorId         UNIQUEIDENTIFIER NOT NULL,
    Status          NVARCHAR(20)     NOT NULL DEFAULT 'Notified'
                        CHECK (Status IN ('Notified','Responded','Confirmed','Declined')),
    RespondedAt     DATETIME         NULL,
    ConfirmedAt     DATETIME         NULL,
    DeclinedAt      DATETIME         NULL,
    DeclineReason   NVARCHAR(255)    NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    UNIQUE (RequestId, DonorId),
    FOREIGN KEY (RequestId) REFERENCES BloodRequests(Id) ON DELETE CASCADE,
    FOREIGN KEY (DonorId)   REFERENCES DonorProfiles(Id)
);

-- 3.3 REQUEST NOTIFICATION LOG (which donors were notified and when)
CREATE TABLE RequestNotificationLog (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequestId   UNIQUEIDENTIFIER NOT NULL,
    DonorId     UNIQUEIDENTIFIER NOT NULL,
    Channel     NVARCHAR(20)     NOT NULL CHECK (Channel IN ('Push','SMS','Email')),
    SentAt      DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (RequestId) REFERENCES BloodRequests(Id) ON DELETE CASCADE,
    FOREIGN KEY (DonorId)   REFERENCES DonorProfiles(Id)
);


-- =====================================================
-- SECTION 4 — DONATIONS
-- =====================================================

-- 4.1 DONATIONS (completed transfusions)
CREATE TABLE Donations (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequestId       UNIQUEIDENTIFIER NOT NULL,
    DonorId         UNIQUEIDENTIFIER NOT NULL,
    HospitalId      UNIQUEIDENTIFIER NULL,
    UnitsDonated    INT              NOT NULL CHECK (UnitsDonated > 0),
    DonationDate    DATETIME         DEFAULT GETDATE(),
    ConfirmedByUserId UNIQUEIDENTIFIER NULL,  -- hospital staff who confirmed
    Notes           NVARCHAR(500)    NULL,
    FOREIGN KEY (RequestId)          REFERENCES BloodRequests(Id),
    FOREIGN KEY (DonorId)            REFERENCES DonorProfiles(Id),
    FOREIGN KEY (HospitalId)         REFERENCES HospitalProfiles(Id),
    FOREIGN KEY (ConfirmedByUserId)  REFERENCES Users(Id)
);

-- 4.2 DONOR AVAILABILITY LOG (audit trail of availability toggles)
CREATE TABLE DonorAvailabilityLog (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DonorId     UNIQUEIDENTIFIER NOT NULL,
    IsAvailable BIT              NOT NULL,
    ChangedAt   DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (DonorId) REFERENCES DonorProfiles(Id) ON DELETE CASCADE
);

-- 4.3 DONOR RATINGS (post-fulfillment feedback from patient/hospital)
CREATE TABLE DonorRatings (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DonationId      UNIQUEIDENTIFIER NOT NULL UNIQUE,
    RatedByUserId   UNIQUEIDENTIFIER NOT NULL,
    DonorId         UNIQUEIDENTIFIER NOT NULL,
    Stars           TINYINT          NOT NULL CHECK (Stars BETWEEN 1 AND 5),
    Tags            NVARCHAR(500)    NULL,  -- JSON array: ["punctual","cooperative"]
    Comment         NVARCHAR(1000)   NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (DonationId)      REFERENCES Donations(Id),
    FOREIGN KEY (RatedByUserId)   REFERENCES Users(Id),
    FOREIGN KEY (DonorId)         REFERENCES DonorProfiles(Id)
);


-- =====================================================
-- SECTION 5 — HOSPITAL INVENTORY
-- =====================================================

-- 5.1 BLOOD INVENTORY (current stock per group per hospital)
CREATE TABLE HospitalInventory (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    HospitalId      UNIQUEIDENTIFIER NOT NULL,
    BloodGroup      NVARCHAR(5)      NOT NULL,
    UnitsAvailable  INT              NOT NULL DEFAULT 0 CHECK (UnitsAvailable >= 0),
    UpdatedAt       DATETIME         DEFAULT GETDATE(),
    UpdatedByUserId UNIQUEIDENTIFIER NULL,
    UNIQUE (HospitalId, BloodGroup),
    FOREIGN KEY (HospitalId)      REFERENCES HospitalProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id)
);

-- 5.2 INVENTORY CHANGE LOG (audit trail of every stock update)
CREATE TABLE InventoryChangeLog (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    HospitalId      UNIQUEIDENTIFIER NOT NULL,
    BloodGroup      NVARCHAR(5)      NOT NULL,
    PreviousUnits   INT              NOT NULL,
    NewUnits        INT              NOT NULL,
    Delta           AS (NewUnits - PreviousUnits) PERSISTED,
    Reason          NVARCHAR(255)    NULL,  -- 'Manual update', 'Donation received', etc.
    ChangedByUserId UNIQUEIDENTIFIER NULL,
    ChangedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (HospitalId)      REFERENCES HospitalProfiles(Id),
    FOREIGN KEY (ChangedByUserId) REFERENCES Users(Id)
);


-- =====================================================
-- SECTION 6 — EMERGENCY SOS
-- =====================================================

-- 6.1 SOS ALERTS
CREATE TABLE SosAlerts (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CreatedByUserId UNIQUEIDENTIFIER NOT NULL,
    BloodGroup      NVARCHAR(5)      NOT NULL,
    UnitsRequired   INT              NOT NULL,
    PatientName     NVARCHAR(100)    NULL,
    ContactPhone    NVARCHAR(15)     NULL,
    HospitalName    NVARCHAR(200)    NULL,
    Latitude        FLOAT            NULL,
    Longitude       FLOAT            NULL,
    RadiusKm        FLOAT            DEFAULT 5,
    Status          NVARCHAR(20)     NOT NULL DEFAULT 'Active'
                        CHECK (Status IN ('Active','Resolved','Expired')),
    ResolvedAt      DATETIME         NULL,
    ExpiresAt       DATETIME         NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id)
);

-- 6.2 SOS RESPONSES (donors who responded to an SOS)
CREATE TABLE SosResponses (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SosId       UNIQUEIDENTIFIER NOT NULL,
    DonorId     UNIQUEIDENTIFIER NOT NULL,
    Status      NVARCHAR(20)     NOT NULL DEFAULT 'Responded'
                    CHECK (Status IN ('Responded','Confirmed','Declined')),
    RespondedAt DATETIME         DEFAULT GETDATE(),
    UNIQUE (SosId, DonorId),
    FOREIGN KEY (SosId)    REFERENCES SosAlerts(Id) ON DELETE CASCADE,
    FOREIGN KEY (DonorId)  REFERENCES DonorProfiles(Id)
);


-- =====================================================
-- SECTION 7 — MESSAGING
-- =====================================================

-- 7.1 CHAT CONVERSATIONS
CREATE TABLE ChatConversations (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequestId       UNIQUEIDENTIFIER NULL,  -- conversation linked to a blood request
    ParticipantAId  UNIQUEIDENTIFIER NOT NULL,
    ParticipantBId  UNIQUEIDENTIFIER NOT NULL,
    LastMessageAt   DATETIME         NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (RequestId)       REFERENCES BloodRequests(Id),
    FOREIGN KEY (ParticipantAId)  REFERENCES Users(Id),
    FOREIGN KEY (ParticipantBId)  REFERENCES Users(Id)
);

-- 7.2 CHAT MESSAGES
CREATE TABLE ChatMessages (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ConversationId  UNIQUEIDENTIFIER NOT NULL,
    SenderId        UNIQUEIDENTIFIER NOT NULL,
    Body            NVARCHAR(2000)   NOT NULL,
    IsRead          BIT              DEFAULT 0,
    ReadAt          DATETIME         NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (ConversationId) REFERENCES ChatConversations(Id) ON DELETE CASCADE,
    FOREIGN KEY (SenderId)       REFERENCES Users(Id)
);


-- =====================================================
-- SECTION 8 — NOTIFICATIONS
-- =====================================================

-- 8.1 NOTIFICATIONS
CREATE TABLE Notifications (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    Type        NVARCHAR(50)     NOT NULL,  -- 'DonorResponded', 'RequestFulfilled', 'SosAlert', etc.
    Title       NVARCHAR(200)    NOT NULL,
    Message     NVARCHAR(500)    NOT NULL,
    LinkUrl     NVARCHAR(500)    NULL,  -- deep link: /dashboard/patient/requests/xxx
    RefId       UNIQUEIDENTIFIER NULL,  -- FK to the related entity (request, sos, etc.)
    IsRead      BIT              DEFAULT 0,
    ReadAt      DATETIME         NULL,
    CreatedAt   DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 8.2 PUSH NOTIFICATION TOKENS (for FCM / APNs)
CREATE TABLE PushTokens (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    Token       NVARCHAR(500)    NOT NULL,
    Platform    NVARCHAR(10)     NOT NULL CHECK (Platform IN ('Web','iOS','Android')),
    IsActive    BIT              DEFAULT 1,
    CreatedAt   DATETIME         DEFAULT GETDATE(),
    UNIQUE (UserId, Token),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);


-- =====================================================
-- SECTION 9 — ADMIN & AUDIT
-- =====================================================

-- 9.1 ADMIN ACTION LOG (approve/reject/suspend history)
CREATE TABLE AdminActionLog (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AdminId         UNIQUEIDENTIFIER NOT NULL,
    ActionType      NVARCHAR(50)     NOT NULL,  -- 'ApproveHospital','RejectHospital','SuspendUser', etc.
    TargetEntityType NVARCHAR(50)    NOT NULL,  -- 'Hospital', 'User', 'BloodRequest'
    TargetEntityId  UNIQUEIDENTIFIER NOT NULL,
    Notes           NVARCHAR(1000)   NULL,
    CreatedAt       DATETIME         DEFAULT GETDATE(),
    FOREIGN KEY (AdminId) REFERENCES Users(Id)
);

-- 9.2 USER SUSPENSION LOG
CREATE TABLE UserSuspensions (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId          UNIQUEIDENTIFIER NOT NULL,
    SuspendedByAdminId UNIQUEIDENTIFIER NOT NULL,
    Reason          NVARCHAR(500)    NOT NULL,
    SuspendedAt     DATETIME         DEFAULT GETDATE(),
    LiftedAt        DATETIME         NULL,
    LiftedByAdminId UNIQUEIDENTIFIER NULL,
    FOREIGN KEY (UserId)             REFERENCES Users(Id),
    FOREIGN KEY (SuspendedByAdminId) REFERENCES Users(Id),
    FOREIGN KEY (LiftedByAdminId)    REFERENCES Users(Id)
);


-- =====================================================
-- SECTION 10 — SAVED / PREFERENCES
-- =====================================================

-- 10.1 PATIENT SAVED HOSPITALS
CREATE TABLE PatientSavedHospitals (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientId   UNIQUEIDENTIFIER NOT NULL,
    HospitalId  UNIQUEIDENTIFIER NOT NULL,
    SavedAt     DATETIME         DEFAULT GETDATE(),
    UNIQUE (PatientId, HospitalId),
    FOREIGN KEY (PatientId)  REFERENCES PatientProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (HospitalId) REFERENCES HospitalProfiles(Id)
);

-- 10.2 USER NOTIFICATION PREFERENCES
CREATE TABLE NotificationPreferences (
    Id                      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId                  UNIQUEIDENTIFIER UNIQUE NOT NULL,
    PushEnabled             BIT DEFAULT 1,
    SmsEnabled              BIT DEFAULT 1,
    EmailEnabled            BIT DEFAULT 1,
    NewRequestAlerts        BIT DEFAULT 1,
    DonorResponseAlerts     BIT DEFAULT 1,
    FulfillmentAlerts       BIT DEFAULT 1,
    SosAlerts               BIT DEFAULT 1,
    UpdatedAt               DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);


-- =====================================================
-- INDEXES — PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX IDX_Users_Email        ON Users(Email);
CREATE INDEX IDX_Users_Phone        ON Users(Phone);
CREATE INDEX IDX_Users_Role         ON Users(Role);

-- Donor lookup
CREATE INDEX IDX_Donor_BloodGroup   ON DonorProfiles(BloodGroup);
CREATE INDEX IDX_Donor_Available    ON DonorProfiles(IsAvailable);
CREATE INDEX IDX_Donor_Location     ON DonorProfiles(Latitude, Longitude);
CREATE INDEX IDX_Donor_UserId       ON DonorProfiles(UserId);

-- Blood requests
CREATE INDEX IDX_Request_Status     ON BloodRequests(Status);
CREATE INDEX IDX_Request_BloodGroup ON BloodRequests(BloodGroup);
CREATE INDEX IDX_Request_Urgency    ON BloodRequests(Urgency);
CREATE INDEX IDX_Request_CreatedBy  ON BloodRequests(CreatedByUserId);
CREATE INDEX IDX_Request_Hospital   ON BloodRequests(HospitalId);
CREATE INDEX IDX_Request_Location   ON BloodRequests(Latitude, Longitude);
CREATE INDEX IDX_Request_CreatedAt  ON BloodRequests(CreatedAt DESC);

-- Responses & donations
CREATE INDEX IDX_Response_Request   ON RequestResponses(RequestId);
CREATE INDEX IDX_Response_Donor     ON RequestResponses(DonorId);
CREATE INDEX IDX_Response_Status    ON RequestResponses(Status);
CREATE INDEX IDX_Donation_Donor     ON Donations(DonorId);
CREATE INDEX IDX_Donation_Date      ON Donations(DonationDate DESC);

-- Notifications
CREATE INDEX IDX_Notif_UserId       ON Notifications(UserId);
CREATE INDEX IDX_Notif_IsRead       ON Notifications(IsRead);
CREATE INDEX IDX_Notif_CreatedAt    ON Notifications(CreatedAt DESC);

-- Chat
CREATE INDEX IDX_Chat_Conv          ON ChatMessages(ConversationId);
CREATE INDEX IDX_Chat_CreatedAt     ON ChatMessages(CreatedAt DESC);
CREATE INDEX IDX_Conv_ParticipantA  ON ChatConversations(ParticipantAId);
CREATE INDEX IDX_Conv_ParticipantB  ON ChatConversations(ParticipantBId);

-- Inventory
CREATE INDEX IDX_Inventory_Hospital ON HospitalInventory(HospitalId);
CREATE INDEX IDX_Inventory_Group    ON HospitalInventory(BloodGroup);

-- SOS
CREATE INDEX IDX_Sos_Status         ON SosAlerts(Status);
CREATE INDEX IDX_Sos_Location       ON SosAlerts(Latitude, Longitude);

-- OTP & sessions
CREATE INDEX IDX_Otp_UserId         ON OtpVerifications(UserId);
CREATE INDEX IDX_Otp_Expires        ON OtpVerifications(ExpiresAt);
CREATE INDEX IDX_Session_UserId     ON UserSessions(UserId);
CREATE INDEX IDX_Session_Expires    ON UserSessions(ExpiresAt);


-- =====================================================
-- VIEWS — COMMON QUERIES
-- =====================================================

-- V1: Active donors with availability and cooldown status
CREATE VIEW vw_ActiveDonors AS
SELECT
    u.Id          AS UserId,
    u.Name,
    u.Phone,
    dp.Id         AS DonorProfileId,
    dp.BloodGroup,
    dp.City,
    dp.Latitude,
    dp.Longitude,
    dp.IsAvailable,
    dp.LastDonationDate,
    dp.ReliabilityScore,
    CASE
        WHEN dp.LastDonationDate IS NULL THEN 0
        WHEN DATEDIFF(DAY, dp.LastDonationDate, GETDATE()) < 90 THEN 1
        ELSE 0
    END AS IsInCooldown,
    CASE
        WHEN dp.LastDonationDate IS NULL THEN GETDATE()
        ELSE DATEADD(DAY, 90, dp.LastDonationDate)
    END AS EligibleFrom
FROM Users u
JOIN DonorProfiles dp ON dp.UserId = u.Id
WHERE u.IsActive = 1 AND u.Role = 'Donor';

-- V2: Open blood requests with hospital info
CREATE VIEW vw_OpenBloodRequests AS
SELECT
    br.Id,
    br.CreatedByUserId,
    br.SourceType,
    br.PatientName,
    br.BloodGroup,
    br.UnitsRequired,
    br.Urgency,
    br.Status,
    br.HospitalName,
    br.Area,
    br.City,
    br.Latitude,
    br.Longitude,
    br.CrossmatchRequired,
    br.CreatedAt,
    hp.IsVerified AS HospitalVerified,
    (
        SELECT COUNT(*)
        FROM RequestResponses rr
        WHERE rr.RequestId = br.Id
          AND rr.Status IN ('Responded','Confirmed')
    ) AS ResponderCount
FROM BloodRequests br
LEFT JOIN HospitalProfiles hp ON hp.Id = br.HospitalId
WHERE br.Status IN ('Open','Matched');

-- V3: Unread notification count per user
CREATE VIEW vw_UnreadNotifCount AS
SELECT
    UserId,
    COUNT(*) AS UnreadCount
FROM Notifications
WHERE IsRead = 0
GROUP BY UserId;

-- V4: Hospital inventory summary with status
CREATE VIEW vw_HospitalInventorySummary AS
SELECT
    hi.HospitalId,
    hp.HospitalName,
    hi.BloodGroup,
    hi.UnitsAvailable,
    CASE
        WHEN hi.UnitsAvailable = 0 THEN 'Out'
        WHEN hi.UnitsAvailable <= 1 THEN 'Critical'
        WHEN hi.UnitsAvailable <= 3 THEN 'Low'
        ELSE 'OK'
    END AS StockStatus,
    hi.UpdatedAt
FROM HospitalInventory hi
JOIN HospitalProfiles hp ON hp.Id = hi.HospitalId;


-- =====================================================
-- STORED PROCEDURES — COMMON OPERATIONS
-- =====================================================

-- SP1: Confirm a donation + update donor stats + start cooldown
CREATE PROCEDURE sp_ConfirmDonation
    @RequestId      UNIQUEIDENTIFIER,
    @DonorId        UNIQUEIDENTIFIER,
    @HospitalId     UNIQUEIDENTIFIER,
    @UnitsDonated   INT,
    @ConfirmedByUserId UNIQUEIDENTIFIER,
    @Notes          NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    -- 1. Insert donation record
    INSERT INTO Donations (RequestId, DonorId, HospitalId, UnitsDonated, ConfirmedByUserId, Notes)
    VALUES (@RequestId, @DonorId, @HospitalId, @UnitsDonated, @ConfirmedByUserId, @Notes);

    -- 2. Update donor's last donation date and increment count
    UPDATE DonorProfiles
    SET
        LastDonationDate = CAST(GETDATE() AS DATE),
        TotalDonations   = TotalDonations + 1,
        ReliabilityScore = CASE WHEN ReliabilityScore + 20 > 100 THEN 100 ELSE ReliabilityScore + 20 END,
        UpdatedAt        = GETDATE()
    WHERE Id = @DonorId;

    -- 3. Mark request as fulfilled
    UPDATE BloodRequests
    SET Status = 'Fulfilled', FulfilledAt = GETDATE(), UpdatedAt = GETDATE()
    WHERE Id = @RequestId;

    -- 4. Mark response as confirmed
    UPDATE RequestResponses
    SET Status = 'Confirmed', ConfirmedAt = GETDATE()
    WHERE RequestId = @RequestId AND DonorId = @DonorId;

    COMMIT TRANSACTION;
END;

-- SP2: Find compatible available donors within a radius (km)
CREATE PROCEDURE sp_FindCompatibleDonors
    @BloodGroup     NVARCHAR(5),
    @Latitude       FLOAT,
    @Longitude      FLOAT,
    @RadiusKm       FLOAT = 10
AS
BEGIN
    SET NOCOUNT ON;

    -- Haversine approximation (degrees → km at equator: 1 deg ≈ 111.195 km)
    SELECT
        dp.Id           AS DonorProfileId,
        u.Name,
        dp.BloodGroup,
        dp.City,
        dp.ReliabilityScore,
        dp.LastDonationDate,
        dp.Latitude,
        dp.Longitude,
        ROUND(
            6371 * 2 * ASIN(SQRT(
                POWER(SIN(RADIANS(dp.Latitude  - @Latitude)  / 2), 2) +
                COS(RADIANS(@Latitude)) * COS(RADIANS(dp.Latitude)) *
                POWER(SIN(RADIANS(dp.Longitude - @Longitude) / 2), 2)
            )), 2
        ) AS DistanceKm
    FROM DonorProfiles dp
    JOIN Users u ON u.Id = dp.UserId
    WHERE
        dp.IsAvailable = 1
        AND u.IsActive = 1
        AND (
            dp.LastDonationDate IS NULL
            OR DATEDIFF(DAY, dp.LastDonationDate, GETDATE()) >= 90
        )
        AND dp.BloodGroup IN (
            -- Compatible donors for the requested blood group
            SELECT value FROM STRING_SPLIT(
                CASE @BloodGroup
                    WHEN 'O-'  THEN 'O-'
                    WHEN 'O+'  THEN 'O-,O+'
                    WHEN 'A-'  THEN 'O-,A-'
                    WHEN 'A+'  THEN 'O-,O+,A-,A+'
                    WHEN 'B-'  THEN 'O-,B-'
                    WHEN 'B+'  THEN 'O-,O+,B-,B+'
                    WHEN 'AB-' THEN 'O-,A-,B-,AB-'
                    WHEN 'AB+' THEN 'O-,O+,A-,A+,B-,B+,AB-,AB+'
                END, ','
            )
        )
        AND 6371 * 2 * ASIN(SQRT(
                POWER(SIN(RADIANS(dp.Latitude  - @Latitude)  / 2), 2) +
                COS(RADIANS(@Latitude)) * COS(RADIANS(dp.Latitude)) *
                POWER(SIN(RADIANS(dp.Longitude - @Longitude) / 2), 2)
            )) <= @RadiusKm
    ORDER BY DistanceKm ASC, dp.ReliabilityScore DESC;
END;


-- =====================================================
-- SEED DATA — BLOOD GROUP REFERENCE
-- =====================================================

CREATE TABLE BloodGroupCompatibility (
    DonorGroup      NVARCHAR(5) NOT NULL,
    RecipientGroup  NVARCHAR(5) NOT NULL,
    PRIMARY KEY (DonorGroup, RecipientGroup)
);

INSERT INTO BloodGroupCompatibility (DonorGroup, RecipientGroup) VALUES
('O-','O-'),  ('O-','O+'),  ('O-','A-'),  ('O-','A+'),
('O-','B-'),  ('O-','B+'),  ('O-','AB-'), ('O-','AB+'),
('O+','O+'),  ('O+','A+'),  ('O+','B+'),  ('O+','AB+'),
('A-','A-'),  ('A-','A+'),  ('A-','AB-'), ('A-','AB+'),
('A+','A+'),  ('A+','AB+'),
('B-','B-'),  ('B-','B+'),  ('B-','AB-'), ('B-','AB+'),
('B+','B+'),  ('B+','AB+'),
('AB-','AB-'),('AB-','AB+'),
('AB+','AB+');

-- =====================================================
-- END OF SCHEMA v2.0
-- =====================================================
