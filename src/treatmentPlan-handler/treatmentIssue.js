/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const treatmentQueries = require('./postTreatment.js');

const savetreatmentIssues = async (req) => {
  const vet = req.params.veteran_id;
  const treatmentIssues = req.body.treatmentIssues[0];
  let i; let j; let k; let l; let m; let n; let o; let p = 0;
  for (i = 0; i < 3; i++) {
    let requestObjIssuesPH = null;
    const goal_type = 'physical health';
    const goals = treatmentIssues.physicalHealth[i].goals;
    const plans = treatmentIssues.physicalHealth[i].plans;
    const strategies = treatmentIssues.physicalHealth[i].strategies;
    const targetDate = treatmentIssues.physicalHealth[i].targetDate;
    if (goals) {
      requestObjIssuesPH = [
        vet,
        goal_type,
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
  for (j = 0; j < 3; j++) {
    let requestObjIssuesMH = null;
    const goal_type = 'mental health';
    const goals = treatmentIssues.mentalHealth[j].goals;
    const plans = treatmentIssues.mentalHealth[j].plans;
    const strategies = treatmentIssues.mentalHealth[j].strategies;
    const targetDate = treatmentIssues.mentalHealth[j].targetDate;
    if (goals) {
      requestObjIssuesMH = [
        vet,
        goal_type,
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
  for (k = 0; k < 3; k++) {
    let requestObjIssuesSU = null;
    const goal_type = 'substance use';
    const goals = treatmentIssues.substanceUse[k].goals;
    const plans = treatmentIssues.substanceUse[k].plans;
    const strategies = treatmentIssues.substanceUse[k].strategies;
    const targetDate = treatmentIssues.substanceUse[k].targetDate;
    if (goals) {
      requestObjIssuesSU = [
        vet,
        goal_type,
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
  for (l = 0; l < 3; l++) {
    let requestObjIssuesHO = null;
    const goal_type = 'housing';
    const goals = treatmentIssues.housing[l].goals;
    const plans = treatmentIssues.housing[l].plans;
    const strategies = treatmentIssues.housing[l].strategies;
    const targetDate = treatmentIssues.housing[l].targetDate;
    if (goals) {
      requestObjIssuesHO = [
        vet,
        goal_type,
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
  for (m = 0; m < 3; m++) {
    let requestObjIssuesIL = null;
    const goal_type = 'social';
    const goals = treatmentIssues.incomeLegal[m].goals;
    const plans = treatmentIssues.incomeLegal[m].plans;
    const strategies = treatmentIssues.incomeLegal[m].strategies;
    const targetDate = treatmentIssues.incomeLegal[m].targetDate;
    if (goals) {
      requestObjIssuesIL = [
        vet,
        goal_type,
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
  for (n = 0; n < 3; n++) {
    let requestObjIssuesR = null;
    const goal_type = 'family';
    const goals = treatmentIssues.relationships[n].goals;
    const plans = treatmentIssues.relationships[n].plans;
    const strategies = treatmentIssues.relationships[n].strategies;
    const targetDate = treatmentIssues.relationships[n].targetDate;
    if (goals) {
      requestObjIssuesR = [
        vet,
        goal_type,
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
  for (o = 0; o < 3; o++) {
    let requestObjIssuesE = null;
    const goal_type = 'career';
    const goals = treatmentIssues.education[o].goals;
    const plans = treatmentIssues.education[o].plans;
    const strategies = treatmentIssues.education[o].strategies;
    const targetDate = treatmentIssues.education[o].targetDate;
    if (goals) {
      requestObjIssuesE = [
        vet,
        goal_type,
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
  for (p = 0; p < 3; p++) {
    let requestObjIssuesB = null;
    const goal_type = 'benefits';
    const goals = treatmentIssues.benefits[p].goals;
    const plans = treatmentIssues.benefits[p].plans;
    const strategies = treatmentIssues.benefits[p].strategies;
    const targetDate = treatmentIssues.benefits[p].targetDate;
    if (goals) {
      requestObjIssuesB = [
        vet,
        goal_type,
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
