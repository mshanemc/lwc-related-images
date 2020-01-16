sfdx force:org:create -f config/project-scratch-def.json -d 1 -s
sfdx force:source:push
sfdx force:data:record:create --sobjecttype Account --values "Name='Test Account'"
accountId=`sfdx shane:data:id:query --object Account --where "Name='Test Account'"`

sfdx shane:data:file:upload --file data/guest\ balcony.jpeg --parentid $accountId
sfdx shane:data:file:upload --file data/sunset_yak.jpg --parentid $accountId
sfdx shane:data:file:upload --file data/sampleChatterPost.png --parentid $accountId --chatter
sfdx shane:data:file:upload --file data/extra1.png --parentid $accountId
sfdx shane:data:file:upload --file data/extra2.png --parentid $accountId

sfdx force:data:record:create --sobjecttype Account --values "Name='Empty Account'"
account2Id=`sfdx shane:data:id:query --object Account --where "Name='Empty Account'"`


sfdx force:org:open -p /lightning/r/Account/$accountId/view
sfdx force:org:open -p /lightning/r/Account/$account2Id/view