export const aboutQuery = `
*[_type == "about"][0]{
  _id,
  studioText,
  services,
  clients,
  offices,
  contact,
  platforms
}
`