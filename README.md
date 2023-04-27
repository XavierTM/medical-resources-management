
# Setting up on windows
## 1. Installation
1. Download and install git bash
2. Download and install NodeJS
3. Calculate 

## 2. Dowloading source code
1. Open git bash
2. Navigate to where you want to save the code using the `cd` command
3. Run the following command:
   ```bash
   git clone http://github.com/XavierTM/medical-resources-management.git
   ```

## 3. Package installation and compilation
1. Navigate to the code folder:
   ```bash
   cd medical-resources-management
   ```
2. Navigate to the `api` folder and run install command:
   ```bash
   cd api
   npm install
   ```
3. Navigate to the `ui` folder and run install command:
   ```bash
   cd ../ui
   npm install --force
   ```
4. Run the UI compilation script:
   ```bash
   cd ..
   bash compile-ui.sh
   ```


## 4. Setting up environment variables
1. Create a  `.env` file named with no file name inside the `api` folder. Open the file and post the following:
```env
PORT=8080
NODE_ENV=production
JWT_SECRET=3f2a3cb7-91a9-4e38-b368-df0c5c0cc831
ADMIN_EMAIL=(provide your email)
ADMIN_PASSWORD=(provide your password)
PASSWORD_SALT_ROUNDS=5
```

2. Run the system
   ```bash
   cd api
   npm start

3. Go to [http://localhost:8080](http://localhost:8080) on your browser. The **admin** login details are the ones you chose while creating the `.env` file.

