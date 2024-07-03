
const generateCredential = () => {
  const credential = import.meta.env.CUSTOMER_KEY + ":" + import.meta.env.CUSTOMER_SECRET

  const base64_credential = btoa(credential)
  return base64_credential
}


export default generateCredential