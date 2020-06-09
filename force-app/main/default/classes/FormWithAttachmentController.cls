public without sharing class FormWithAttachmentController {
   

        //We will call this function in order to delete the linkage to the dummy record on file upload
        //and to change the owner of the File away from the guest-site user...
        @AuraEnabled
        public static void removeContentLinktoDummyRecord(List<String> documents){

            List<ContentDocumentLink> linksToDelete = new List<ContentDocumentLink>();
            Set<Id> documentIds = new Set<Id>();

            for(String doc : documents) {
                documentIds.add(doc);
            }

            for (ContentDocumentLink link : [SELECT Id, LinkedEntityId, ContentDocumentId FROM ContentDocumentLink WHERE ContentDocumentId IN: documentIds AND LinkedEntityId = 'a046g00000ME88jAAD']){

                linksToDelete.add(link);
            }

            delete linksToDelete;
            changeOwnerOfUpload(documentIds);
        }

        // Used to change the Owner of the file to someone internal
        // TO DO abstract this OwnerId into either the component file or custom meta-data... 
        public static void changeOwnerOfUpload(Set<Id> docIds){

            List<ContentDocument> newDocs = new List<ContentDocument>();

            for (ContentDocument myDoc : [SELECT Id FROM ContentDocument WHERE Id IN: docIds]){
                myDoc.OwnerId = '0056g000000khIbAAI';
                newDocs.add(mydoc);
            }
            update newDocs;
        }

        //This method will insert the new record and then create the necessary ContentDocumentLinks
        //to associate the files with the newly submitted record.
        @AuraEnabled
        public static void submitForm(MyCustomObject__c myRecord, List<String> documents) {

            insert myRecord;
            system.debug(myRecord.Id);
            List<ContentDocumentLink> newLinks = new List<ContentDocumentLink>();

            for(String docId : documents) {

                ContentDocumentLink newLink = new ContentDocumentLink(LinkedEntityId = myRecord.Id, 
                                                                      ContentDocumentId = docId,
                                                                      ShareType = 'v'
                                                                      );
                newLinks.add(newLink);
            }
            
            insert newLinks;

        }

    
}
