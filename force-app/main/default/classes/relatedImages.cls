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
        for (FeedItem fi: [select id, RelatedRecordId, ParentId from FeedItem where parentId =: recordId]) {
            output.add(fi.RelatedRecordId);
        }
        return output;
    }

    @auraEnabled(cacheable=true)
    public static list<ContentVersion> getRelatedImages(id recordId) {
        return [select id, VersionData, ContentDocumentId, Title, Description 
        from ContentVersion 
        where 
            IsLatest = true 
            AND fileExtension in: extensions 
            AND ContentDocumentId in: getRelatedContentDocumentIDs(recordId)
            AND Id NOT in: getChatterFiles(recordId)
        ];
    }

}