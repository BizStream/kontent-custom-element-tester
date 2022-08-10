const config = {
  // [ Optional ] Address can be a strint or function in the form '(portNumber) => finalAddressAsString'
  // DEFAULT: '' 
  // addr: port => `https://localhost:${port}`,
  
  // [ Optional ] Port number
  // DEFAULT: 8000
  // port: 8000,
  
  // [ Optional ] Express server settings
  // DEFAULT: NULL
  // express: {
  //   staticFilesPath: ".",
  // },

  // Required Kontent.ai keys
  kontent: {
    projectId: "",
    apiKey: "",
    elementCodename: "custom_element_test" // Kontent.ai Model codename (alphanumeric and underscrore characters)
  }
}

export default config;
