if(currentQuestStep()==0)
	return 1;//do you want accept the quest
if(currentQuestStep()==1)
{
	if(haveQuestStepRequirements())
		return 2;//give all object to pass to step 2
	else
		return 42;//need more object
}
if(currentQuestStep()==2)
{
	if(haveQuestStepRequirements())
		return 12;//give all object to pass to step 2
	else
		return 52;//need more object
}

if(currentQuestStep()==3)

	return 15;//to finish the quest
