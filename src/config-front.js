const config = {
    "development": {
      "backend": {
        "port": 3000,
        "url": "http://localhost:3000",
        "clean": "http://localhost:",
      }
    },
    "production": {
      "backend": {
        "port": 3000,
        "url": "http://3.68.213.133:3000",
        "clean": "http://3.68.213.133:",
      }
    }
  };
  
  const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return config[env];
  };
  
  export default getConfig();
  