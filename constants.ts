import path = require("path");
import fs = require("fs");

export const awsAccount = {
    account: '939499127636', 
    region: 'us-east-1' 
};

// User Data file to be used for EC2 instance
export const userData = fs.readFileSync(path.join(__dirname, './scripts/chess-server.sh'), 'utf8');