export const aboutQuery = `
*[_type == "about"][0]{
  _id,
  studioText,
  services[]->{title},
  clients,
  offices,
  contact,
  platforms
}
`