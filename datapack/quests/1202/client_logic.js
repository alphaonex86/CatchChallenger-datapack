if(currentQuestStep()==0)
	return 1;//do you want accept the quest
if(currentQuestStep()==1)
{
	if(haveQuestStepRequirements())
		return 50;//give all object to pass to step 2
	else
		return 42;//need more object
}

