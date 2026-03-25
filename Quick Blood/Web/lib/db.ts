import sql from "mssql"

const config: sql.config = {
  server:   process.env.DB_SERVER   ?? "localhost",
  port:     parseInt(process.env.DB_PORT ?? "1433"),
  database: process.env.DB_NAME     ?? "QuickBlood",
  user:     process.env.DB_USER     ?? "sa",
  password: process.env.DB_PASSWORD ?? "",
  options: {
    encrypt:              true,
    trustServerCertificate: process.env.NODE_ENV !== "production", // trust cert in dev
    enableArithAbort:     true,
  },
  pool: {
    max:              10,
    min:               2,
    idleTimeoutMillis: 30000,
  },
}

// Singleton pool — reused across requests in the same server process
declare global {
  // eslint-disable-next-line no-var
  var __sqlPool: sql.ConnectionPool | undefined
}

async function getPool(): Promise<sql.ConnectionPool> {
  if (global.__sqlPool && global.__sqlPool.connected) {
    return global.__sqlPool
  }
  const pool = new sql.ConnectionPool(config)
  await pool.connect()
  global.__sqlPool = pool
  return pool
}

/** Run a parameterised query and return all rows. */
export async function query<T = sql.IRecordSet<Record<string, unknown>>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T> {
  const pool    = await getPool()
  const request = pool.request()

  // Build the SQL string, binding each interpolated value as a parameter
  let sql_str = ""
  strings.forEach((part, i) => {
    sql_str += part
    if (i < values.length) {
      const name = `p${i}`
      request.input(name, values[i])
      sql_str += `@${name}`
    }
  })

  const result = await request.query(sql_str)
  return result.recordset as T
}

/** Execute a statement and return the full result (rows + rowsAffected). */
export async function execute(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<sql.IResult<unknown>> {
  const pool    = await getPool()
  const request = pool.request()

  let sql_str = ""
  strings.forEach((part, i) => {
    sql_str += part
    if (i < values.length) {
      const name = `p${i}`
      request.input(name, values[i])
      sql_str += `@${name}`
    }
  })

  return request.query(sql_str)
}

/** Get a raw request object when you need fine-grained parameter control. */
export async function getRequest(): Promise<sql.Request> {
  const pool = await getPool()
  return pool.request()
}

export { sql }
