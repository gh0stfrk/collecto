import QRCode from 'qrcode'

export function generateUPILink(upiId: string, name: string, amount: number, note: string = 'Collecto Payment') {
  // GPay requires specific parameter order and encoding for transaction notes to work
  const encodedNote = encodeURIComponent(note)
  const encodedName = encodeURIComponent(name)
  
  // Use manual construction instead of URLSearchParams for better GPay compatibility
  return `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}&mc=0000&mode=02&purpose=00`
}

export async function generateQRCode(upiLink: string) {
  return QRCode.toDataURL(upiLink)
}