const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

function J_ReturnInt16Value(strText) {
    if (strText === "" || strText === null || strText === "-") {
        return 0;
    }
    const num = parseInt(strText.trim(), 10);
    return isNaN(num) ? 0 : num;
}

function J_Left(String, length) {
    return String.substring(0, length);
}

function J_Right(String, length) {
    return String.substring(String.length - length, String.length);
}

function J_Mid(String, startIndex, length) {
    if (length === undefined) {
        return String.substring(startIndex);
    } else {
        return String.substring(startIndex, startIndex + length);
    }
}

function T_GenerateActivationNumber(ConfigurationNumber, Version) {
    try {
        let text = "";
        ConfigurationNumber = ConfigurationNumber.replace(/-/g, "");
        let text2 = J_Left(ConfigurationNumber, 4) + J_Right(ConfigurationNumber, 4);
        text2 = String(J_ReturnInt16Value(J_Left(text2, 2)) + 
                       J_ReturnInt16Value(J_Mid(text2, 2, 2)) + 
                       J_ReturnInt16Value(J_Right(text2, 4)));
        let text3 = J_Left(text2, 2);
        let text4 = J_Right(text2, 2);
        let midPart = J_Mid(ConfigurationNumber, 4, ConfigurationNumber.length - 8);
        let text5 = J_Left(midPart, 2).toUpperCase();
        let text6 = J_Right(midPart, 2).toUpperCase();
        let text7 = text3 + text6 + text5 + text4 + Version;
        for (let c of text7) {
            text += c.charCodeAt(0);
        }
        return text;
    } catch (e) {
        return "";
    }
}

app.post('/generate-key', (req, res) => {
    const { hwid, year } = req.body;
    if (!hwid || !year) {
        return res.status(400).send('HWID and year are required');
    }
    try {
        const key = T_GenerateActivationNumber(hwid, year);
        res.json({ key });
    } catch (e) {
        res.status(500).send('Error generating key');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});