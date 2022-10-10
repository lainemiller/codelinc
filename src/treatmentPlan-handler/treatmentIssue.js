const treatmentQueries = require('./postTreatment.js');

const savetreatmentIssues = async (req) => {
  const vet = req.params.veteran_id;
  const treatmentIssues = req.body.treatmentIssues[0];
  let i; let j; let k; let l; let m; let n; let o; let p = 0;
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
  for (j = 0; j < treatmentIssues.mentalHealth.length; j++) {
    let requestObjIssuesMH = null;
    const goalType = 'mental health';
    const goals = treatmentIssues.mentalHealth[j].goals;
    const plans = treatmentIssues.mentalHealth[j].plans;
    const strategies = treatmentIssues.mentalHealth[j].strategies;
    const targetDate = treatmentIssues.mentalHealth[j].targetDate;
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
  for (k = 0; k < treatmentIssues.substanceUse.length; k++) {
    let requestObjIssuesSU = null;
    const goalType = 'substance use';
    const goals = treatmentIssues.substanceUse[k].goals;
    const plans = treatmentIssues.substanceUse[k].plans;
    const strategies = treatmentIssues.substanceUse[k].strategies;
    const targetDate = treatmentIssues.substanceUse[k].targetDate;
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
  for (l = 0; l < treatmentIssues.housing.length; l++) {
    let requestObjIssuesHO = null;
    const goalType = 'housing';
    const goals = treatmentIssues.housing[l].goals;
    const plans = treatmentIssues.housing[l].plans;
    const strategies = treatmentIssues.housing[l].strategies;
    const targetDate = treatmentIssues.housing[l].targetDate;
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
  for (m = 0; m < treatmentIssues.incomeLegal.length; m++) {
    let requestObjIssuesIL = null;
    const goalType = 'social';
    const goals = treatmentIssues.incomeLegal[m].goals;
    const plans = treatmentIssues.incomeLegal[m].plans;
    const strategies = treatmentIssues.incomeLegal[m].strategies;
    const targetDate = treatmentIssues.incomeLegal[m].targetDate;
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
  for (n = 0; n < treatmentIssues.relationships.length; n++) {
    let requestObjIssuesR = null;
    const goalType = 'family';
    const goals = treatmentIssues.relationships[n].goals;
    const plans = treatmentIssues.relationships[n].plans;
    const strategies = treatmentIssues.relationships[n].strategies;
    const targetDate = treatmentIssues.relationships[n].targetDate;
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
  for (o = 0; o < treatmentIssues.education.length; o++) {
    let requestObjIssuesE = null;
    const goalType = 'career';
    const goals = treatmentIssues.education[o].goals;
    const plans = treatmentIssues.education[o].plans;
    const strategies = treatmentIssues.education[o].strategies;
    const targetDate = treatmentIssues.education[o].targetDate;
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
  for (p = 0; p < treatmentIssues.benefits.length; p++) {
    let requestObjIssuesB = null;
    const goalType = 'benefits';
    const goals = treatmentIssues.benefits[p].goals;
    const plans = treatmentIssues.benefits[p].plans;
    const strategies = treatmentIssues.benefits[p].strategies;
    const targetDate = treatmentIssues.benefits[p].targetDate;
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
