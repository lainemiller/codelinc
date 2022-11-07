const treatmentQueries = require('./postTreatment.js');

const savetreatmentIssues = async (req) => {
  const vet = req.params.veteran_id;
  const treatmentIssues = req.body.treatmentIssues[0];
  let i = 0;
  for (i = 0; i < treatmentIssues.physicalHealth.length; i++) {
    let requestObjIssuesPH = null;
    const goalType = 'physical health';
    const goals = treatmentIssues.physicalHealth[i].goals;
    const plans = treatmentIssues.physicalHealth[i].plans;
    const strategies = treatmentIssues.physicalHealth[i].strategies;
    const targetDate = treatmentIssues.physicalHealth[i].targetDate;
    if (goals) {
      requestObjIssuesPH = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesPH);
    }
  }
  // MentalHealth
  for (i = 0; i < treatmentIssues.mentalHealth.length; i++) {
    let requestObjIssuesMH = null;
    const goalType = 'mental health';
    const goals = treatmentIssues.mentalHealth[i].goals;
    const plans = treatmentIssues.mentalHealth[i].plans;
    const strategies = treatmentIssues.mentalHealth[i].strategies;
    const targetDate = treatmentIssues.mentalHealth[i].targetDate;
    if (goals) {
      requestObjIssuesMH = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesMH);
    }
  }
  // SubstanceUse
  for (i = 0; i < treatmentIssues.substanceUse.length; i++) {
    let requestObjIssuesSU = null;
    const goalType = 'substance use';
    const goals = treatmentIssues.substanceUse[i].goals;
    const plans = treatmentIssues.substanceUse[i].plans;
    const strategies = treatmentIssues.substanceUse[i].strategies;
    const targetDate = treatmentIssues.substanceUse[i].targetDate;
    if (goals) {
      requestObjIssuesSU = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesSU);
    }
  }
  // Housing
  for (i = 0; i < treatmentIssues.housing.length; i++) {
    let requestObjIssuesHO = null;
    const goalType = 'housing';
    const goals = treatmentIssues.housing[i].goals;
    const plans = treatmentIssues.housing[i].plans;
    const strategies = treatmentIssues.housing[i].strategies;
    const targetDate = treatmentIssues.housing[i].targetDate;
    if (goals) {
      requestObjIssuesHO = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesHO);
    }
  }
  // Income/Financial/Legal
  for (i = 0; i < treatmentIssues.incomeLegal.length; i++) {
    let requestObjIssuesIL = null;
    const goalType = 'social';
    const goals = treatmentIssues.incomeLegal[i].goals;
    const plans = treatmentIssues.incomeLegal[i].plans;
    const strategies = treatmentIssues.incomeLegal[i].strategies;
    const targetDate = treatmentIssues.incomeLegal[i].targetDate;
    if (goals) {
      requestObjIssuesIL = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesIL);
    }
  }
  // Relationships
  for (i = 0; i < treatmentIssues.relationships.length; i++) {
    let requestObjIssuesR = null;
    const goalType = 'family';
    const goals = treatmentIssues.relationships[i].goals;
    const plans = treatmentIssues.relationships[i].plans;
    const strategies = treatmentIssues.relationships[i].strategies;
    const targetDate = treatmentIssues.relationships[i].targetDate;
    if (goals) {
      requestObjIssuesR = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesR);
    }
  }
  // Education
  for (i = 0; i < treatmentIssues.education.length; i++) {
    let requestObjIssuesE = null;
    const goalType = 'career';
    const goals = treatmentIssues.education[i].goals;
    const plans = treatmentIssues.education[i].plans;
    const strategies = treatmentIssues.education[i].strategies;
    const targetDate = treatmentIssues.education[i].targetDate;
    if (goals) {
      requestObjIssuesE = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesE);
    }
  }
  // Benefits/Medicaid/Snap
  for (i = 0; i < treatmentIssues.benefits.length; i++) {
    let requestObjIssuesB = null;
    const goalType = 'benefits';
    const goals = treatmentIssues.benefits[i].goals;
    const plans = treatmentIssues.benefits[i].plans;
    const strategies = treatmentIssues.benefits[i].strategies;
    const targetDate = treatmentIssues.benefits[i].targetDate;
    if (goals) {
      requestObjIssuesB = [
        vet,
        goalType,
        goals,
        req.body.addedDate,
        targetDate,
        plans,
        strategies
      ];
      await treatmentQueries(requestObjIssuesB);
    }
  }
};
module.exports = async function (req) {
  try {
    await savetreatmentIssues(req);
    console.log('Successfully saved Treatmentplan Details');
  } catch (error) {
    console.log(error);
  }
};
