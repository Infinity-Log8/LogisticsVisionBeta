/**
 * generate-id.ts
 * Generates human-friendly, task-linked reference IDs for all entities in Logistics Vision.
 *
 * Format:  PREFIX-YYYYMMDD-XXXX
 *   PREFIX  = 2-4 uppercase letters identifying the entity type
 *   YYYYMMDD = date the record was created (UTC)
 *   XXXX    = 4 alphanumeric characters (uppercase, digits) for uniqueness
 *
 * Examples
 *   Trip      → TRP-20260407-A3K9
 *   Payslip   → PAY-20260407-B7M2
 *   Invoice   → INV-20260407-C1X4
 *   Expense   → EXP-20260407-D5Q8
 *   Commission→ COM-20260407-E2N6
 *   Driver    → DRV-20260407-F8P3
 *   Vehicle   → VEH-20260407-G4R7
 *   Quote     → QUO-20260407-H9S1
 *   Leave     → LVE-20260407-J6T5
 *   Payout    → PTO-20260407-K3V0
 *   Fuel      → FUL-20260407-L1W9
 */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // unambiguous characters (no I,O,0,1)

function randomSuffix(length = 4): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

function datePart(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function buildId(prefix: string, date?: Date): string {
  return `${prefix}-${datePart(date)}-${randomSuffix()}`;
}

// ─── Public generators ────────────────────────────────────────────────────────

/** Trip ID  →  TRP-YYYYMMDD-XXXX */
export function generateTripId(date?: Date): string {
  return buildId('TRP', date);
}

/** Payslip / Payroll run ID  →  PAY-YYYYMMDD-XXXX */
export function generatePayslipId(date?: Date): string {
  return buildId('PAY', date);
}

/** Invoice ID  →  INV-YYYYMMDD-XXXX */
export function generateInvoiceId(date?: Date): string {
  return buildId('INV', date);
}

/** Expense ID  →  EXP-YYYYMMDD-XXXX */
export function generateExpenseId(date?: Date): string {
  return buildId('EXP', date);
}

/** Commission ID  →  COM-YYYYMMDD-XXXX */
export function generateCommissionId(date?: Date): string {
  return buildId('COM', date);
}

/** Driver ID  →  DRV-YYYYMMDD-XXXX */
export function generateDriverId(date?: Date): string {
  return buildId('DRV', date);
}

/** Vehicle ID  →  VEH-YYYYMMDD-XXXX */
export function generateVehicleId(date?: Date): string {
  return buildId('VEH', date);
}

/** Quote ID  →  QUO-YYYYMMDD-XXXX */
export function generateQuoteId(date?: Date): string {
  return buildId('QUO', date);
}

/** Leave request ID  →  LVE-YYYYMMDD-XXXX */
export function generateLeaveId(date?: Date): string {
  return buildId('LVE', date);
}

/** Payout ID  →  PTO-YYYYMMDD-XXXX */
export function generatePayoutId(date?: Date): string {
  return buildId('PTO', date);
}

/** Fuel record ID  →  FUL-YYYYMMDD-XXXX */
export function generateFuelId(date?: Date): string {
  return buildId('FUL', date);
}

/**
 * Generic fallback — use when a specific generator does not exist yet.
 * @param prefix  2-4 uppercase letters, e.g. "ORD"
 */
export function generateGenericId(prefix: string, date?: Date): string {
  return buildId(prefix.toUpperCase().slice(0, 4), date);
}
