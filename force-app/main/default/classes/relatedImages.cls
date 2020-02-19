public with sharing class relatedImages {
    
    static final list<String> extensions = new list<string>{'jpg', 'png', 'jpeg', 'gif'};

    public static list<id> getRelatedContentDocumentIDs(id recordId) {
        list<id> output = new list<id>();
        for (ContentDocumentLink cdl: [select id, ContentDocumentId from ContentDocumentLink where LinkedEntityId =: recordId]) {
            output.add(cdl.ContentDocumentId);
        }
        return output;
    }

    public static list<id> getChatterFiles(id recordId) {
        list<id> output = new list<id>();
        try { 
            Schema.SObjectType token = recordId.getSObjectType();
            Schema.DescribeSObjectResult dr = token.getDescribe();
            if (dr.isFeedEnabled()) {
                string FeedObj = dr.getName().contains('__c') ? dr.getName().replace('__c', '__Feed'):dr.getName() + 'Feed';
                string query = 'select RelatedRecordId from ' + ' where parentId =: \'' + FeedObj +'\'';
                List<SObject> feedItems = Database.query(query);
                for(SObject fi:feedItems) {
                    output.add((string) fi.get('RelatedRecordId'));
                }
            }
        } catch(exception e) {
            // all kinds of things can happen here
            system.debug(e);
        }
        return output;
    }

    @auraEnabled(cacheable=true)
    public static list<ContentVersion> getRelatedImages(id recordId) {
        return [select id 
        from ContentVersion 
        where 
            IsLatest = true 
            AND fileExtension in: extensions 
            AND ContentDocumentId in: getRelatedContentDocumentIDs(recordId)
            AND Id NOT in: getChatterFiles(recordId)
        ];
    }

}