const config = {
    "development": {
      "backend": {
        "port": 3000,
        "mongoURI": "mongodb+srv://dolevg621:uBcPanAlolih5z3d@cluster0.sq5d07w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      },
      "frontend": {
        "url": "http://localhost:8000"
      }
    },
    "production": {
      "backend": {
        "port": 3000,
        "mongoURI": "mongodb+srv://dolevg621:uBcPanAlolih5z3d@cluster0.sq5d07w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      },
      "frontend": {
        "url": "http://3.68.213.133:8000"
      }
    }
  }
  

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

module.exports = getConfig();
