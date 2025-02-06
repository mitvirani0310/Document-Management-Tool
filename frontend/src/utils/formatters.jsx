export function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  
  export function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString()
  }

  export const options = [{
    label: "Default",
    value: "null"
  }, {
    label: "Mortgage",
    value: "Loan Number, Account Number,Min Number,Reference Number"
    // value: "Loan Number, Account Number, Reference Number, FHA Case Number, Min Number, APN, Parcel Number, Tax ID Number, Check Number, Payee Code, NMLS Number, Servicing Number, PIN, Order Number, Case Number, File Number, MERS #, Investor: Bank Owned #, Prior Servicer Number:, Investor: Freddie Mac #, Investor: FHLMC #, Investor: Fannie Mae #, Investor: FNMA #, Investor: Other #, Guarantee Number, Reference #, Order #, Liability, Fee, File No., Agent No., Ref, Order No., Premium, Ref No."
  },{
    label: "Resume",
    value: "Name, Address, Phone Number, Email, Objective, Summary, Experience, Education, Skills, Certification, Projects"
    // value: "Loan Number, Account Number, Reference Number, FHA Case Number, Min Number, APN, Parcel Number, Tax ID Number, Check Number, Payee Code, NMLS Number, Servicing Number, PIN, Order Number, Case Number, File Number, MERS #, Investor: Bank Owned #, Prior Servicer Number:, Investor: Freddie Mac #, Investor: FHLMC #, Investor: Fannie Mae #, Investor: FNMA #, Investor: Other #, Guarantee Number, Reference #, Order #, Liability, Fee, File No., Agent No., Ref, Order No., Premium, Ref No."
  }]
  
  