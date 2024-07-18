const config = {
    "development": {
      "backend": {
        "port": 3000,
        "url": "http://localhost:3000"
      }
    },
    "production": {
      "backend": {
        "port": 3000,
        "url": "http://3.68.213.133:3000"
      }
    }
  };
  
  const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return config[env];
  };
  
  module.exports = getConfig();
  