({
    removeDummyContentLinks : function(component) {

        // Set up params and call server-side method that will do two things:
        // 1) This removes the ContentDocumentLink between dummy record and Files Uploaded
        // 2) This changes to owner from the site guest user to an internal user
        var action = component.get("c.removeContentLinktoDummyRecord");
        
        action.setParams ({

            documents : component.get("v.documents")

        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state==="SUCCESS") {
                console.log("It Worked!");
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
