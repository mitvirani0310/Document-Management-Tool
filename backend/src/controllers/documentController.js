const Document = require("../models/Document");
const path = require("path");
const fs = require("fs");
const documentService = require("../services/documentService");
const { transformResponseData } = require("../utils/execHelper"); 
const config = require("../config/config");
const axios = require("axios");


function transformObjectToArray(obj) {
  return [
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, [value]])
    )
  ];
}


// exports.uploadDocuments = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const documents = await Promise.all(
//       req.files.map((file) => documentService.uploadDocument(file))
//     );

//     res.status(201).json(documents);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files;
    const uploadedDocuments = [];

    for (const file of files) {
      // Check if a document with the same name already exists
      const existingDocument = await documentService.getDocumentByName(file.originalname);

      if (existingDocument) {
        // If the document exists, you can either:
        // 1. Skip the upload and return a message
        console.log(`Document with name ${file.originalname} already exists. Skipping upload.`);
        // 2. Or, you can update the existing document with the new file (be careful with this approach)
        // For this example, we'll skip the upload

        uploadedDocuments.push({
          message: `Document with name ${file.originalname} already exists.`,
          existing: true,
        });
      } else {
        // If the document doesn't exist, upload it
        const document = await documentService.uploadDocument(file);
        uploadedDocuments.push(document);
      }
    }

    if (uploadedDocuments.length === 0) {
      return res.status(200).json({ message: "No new files uploaded, all files already exist." });
    }

    res.status(201).json(uploadedDocuments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await documentService.getAllDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    const filePath = path.resolve(__dirname, "../../", document.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });

    }
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader("Content-Disposition", `attachment; filename="${document.name}"`);

    res.sendFile(filePath);
    console.log("filePath: ", filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRedactedDocument = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve(__dirname, "../../", document.redacted_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ Send JSON metadata first
    res.setHeader('Redacted-Data', JSON.stringify(document.redacted_data));

    // ✅ Send the file
    res.sendFile(filePath);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDocumentMetadata = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document.metadata || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const result = await documentService.deleteDocument(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.extractPdfData = async (req, res) => {
    try {
      const document = await documentService.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const {data : data_elements} = req.body;
      // console.log('data_elements: ', data_elements);

      // TODO: Replace this with actual EXE execution
      // For now returning mock data
      // const mockData = {
      //   "Loan Number": "Rich Dad",
      //   "Loan ID": "Dad",
      //   "Doc Type": "Money",
      //   "Borrower 1 First Name": "impor",
      //   "Borrower 1 Last Name": "this",
      //   "Borrower Vesting Override": "ROBBY SMITH, AN UNMARRIED MAN",
      //   "Borrower Mailing Street Address": "17344 ROSEVILLE BLVD",
      //   "sample":
      //     "dvdhsbvj kfbvhsfbvjfkvb sfjvbsfhvbsfj kvsf,vbsfvbsfl dvnsfvbsfjkvb sfjvsfjvbsfhvgu sfkvhsfjdv bfhvbufkd vbsvgfbsf",
      // };

    // Get absolute path of PDF
  //  if(Object.keys(document.extracted_data).length === 0)  {
    const pdfPath = path.join(__dirname, "../../", document.path);
    
    // Explicitly encode the file path
    const encodedPath = encodeURIComponent(pdfPath);
    
    //  Call extraction API with encoded path
    //  const response = await axios.post(`${config.API_DATA_URL}/extract-data`, {
    //    file_path: pdfPath
    //  });
    // const dataElements = "name,email,phone,address,city,state,zip"; // This can be dynamic
    // `${config.API_DATA_URL}/extract-data?file_path=${encodedPath}&data_elements=${dataElements}`, 
  
    // const response = await axios.post(
    //   `${config.API_DATA_URL}/extract-data?file_path=${encodedPath}&data_elements=${data_elements}`,     
    //   {},
    //   {
    //     headers: {
    //       'accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    const baseUrl = `${config.API_DATA_URL}/extract-data?file_path=${encodedPath}`;
// const apiUrl = data_elements === "default" 
//   ? baseUrl
//   : `${baseUrl}&data_elements=${data_elements}`;

const response = await axios.post(
  baseUrl,     
  req.body,
  {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
);
    
    if (!response) {
      throw new Error('No data received from extraction API');
    }
    
    // const transformedData = transformResponseData(response.data);
    const transformedData = response.data;
    await Document.findByIdAndUpdate(req.params.id, { extracted_data: transformedData,redacted_data: transformedData });
  
    return res.json(transformedData);  // ✅ Ensure only one response is sent
  // }
// else {
//   res.json(document.extracted_data);
// }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.redactPdfData = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    };
    const data = req.body;
  
    if (!data) {
      return res.status(400).json({ message: "Data not provided" });
    }


    // TODO: Replace this with actual EXE execution
    // For now returning mock data
    // const mockData = {
    //   "Loan Number": "Rich Dad",
    //   "Loan ID": "Dad",
    //   "Doc Type": "Money",
    //   "Borrower 1 First Name": "impor",
    //   "Borrower 1 Last Name": "this",
    //   "Borrower Vesting Override": "ROBBY SMITH, AN UNMARRIED MAN",
    //   "Borrower Mailing Street Address": "17344 ROSEVILLE BLVD",
    //   sample:
    //     "dvdhsbvj kfbvhsfbvjfkvb sfjvbsfhvbsfj kvsf,vbsfvbsfl dvnsfvbsfjkvb sfjvsfjvbsfhvgu sfkvhsfjdv bfhvbufkd vbsvgfbsf",
    // };

   // Get absolute path of PDF
   const pdfPath = path.join(__dirname, "../../", document.path);
   
   // Explicitly encode the file path
   const encodedPath = encodeURIComponent(pdfPath);
   
   //Call extraction API with encoded path
  //  const response = await axios.post(`${config.API_DATA_URL}/extract-data`, {
  //    file_path: pdfPath
  //  });

  // const transformedData = transformObjectToArray(data);
  const transformedData = data;
  
  
  const response = await axios.post(
    `${config.API_DATA_URL}/redact-data?file_path=${encodedPath}`,
    transformedData,
    {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'  // To handle binary data (PDF)
    }
  );
  
  res.setHeader('Content-Type', 'application/pdf');
  
  
  const pdfData = response.data;   

  const redactedDir = path.join(__dirname, '../../redacted-uploads');
    if (!fs.existsSync(redactedDir)) {
      fs.mkdirSync(redactedDir, { recursive: true }); // Ensure directory exists
    }

    const parsedPath = path.parse(document.path);  
    const originalFilename = parsedPath.name; // Extract filename without extension
    const redactedFilePath = path.join(redactedDir, `${originalFilename}_redacted.pdf`);

    // Write the redacted PDF to the redacted-uploads folder
    fs.writeFileSync(redactedFilePath, pdfData);

    // redacted-uploads\17337748480736_redacted.pdf
    const redacted_path = `redacted-uploads\\${originalFilename}_redacted.pdf`;

    await documentService.updateDocument(req.params.id, { redacted_data: data ,redacted_path});

    return res.send(pdfData);

    // res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
