({
    handleUploadFinished: function (component, event, helper) {

        // Get the list of uploaded files and log them out
        var uploadedFiles = event.getParam("files");
        console.log("Files uploaded : " + uploadedFiles.length);
        console.log(uploadedFiles);

        // Get the current documentIds array from the component
        var documentIds = component.get("v.documents");

        // Push the new file Ids into the documents array for safe keeping
        // this will be used later in the submit function...
        uploadedFiles.forEach(element => documentIds.push(element.documentId));
        console.log(documentIds);
        
        // Set the documents array with the newly added ids...
        component.set("v.documents", documentIds);
        console.log(component.get("v.documents"));

        // Call helper function to ping server and remove the connection to the dummy
        // and change the owner of the doc to someone internal. THIS IS KEY as it ensures
        // the site guest user loses access to the files upon upload itself...
        helper.removeDummyContentLinks(component);

        
    },

    // This should be another helper function call, but for simplicity and time I just wrote it here...

    submit : function(component, event, helper) {
        
        var action = component.get("c.submitForm");
        
        action.setParams ({

            documents : component.get("v.documents"),
            myRecord : component.get("v.newForm")

        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state==="SUCCESS") {
                confirm("It Worked!");
            }
            else {
                let errors = response.getError();
                let message = 'Unknown error'; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                // Display the message
                console.error(message);
                
            }
        });
        $A.enqueueAction(action);

    }
})
