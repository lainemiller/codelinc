const secrets = require('../secret');
const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.DBENTRY,
  database: secrets.DATABASE,
  port: secrets.PORT
});

const updateTreatment = async (req) => {
  const vet = req.params.veteran_id;
  const treatmentIssues = req.body.treatmentIssues[0];
  let i = 0;
  // physical health
  for (i = 0; i < treatmentIssues.physicalHealth.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.physicalHealth[i].goalid;
    const goals = treatmentIssues.physicalHealth[i].goals;
    const plans = treatmentIssues.physicalHealth[i].plans;
    const strategies = treatmentIssues.physicalHealth[i].strategies;
    const targetDate = treatmentIssues.physicalHealth[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // mental health
  for (i = 0; i < treatmentIssues.mentalHealth.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.mentalHealth[i].goalid;
    const goals = treatmentIssues.mentalHealth[i].goals;
    const plans = treatmentIssues.mentalHealth[i].plans;
    const strategies = treatmentIssues.mentalHealth[i].strategies;
    const targetDate = treatmentIssues.mentalHealth[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Substance Use
  for (i = 0; i < treatmentIssues.substanceUse.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.substanceUse[i].goalid;
    const goals = treatmentIssues.substanceUse[i].goals;
    const plans = treatmentIssues.substanceUse[i].plans;
    const strategies = treatmentIssues.substanceUse[i].strategies;
    const targetDate = treatmentIssues.substanceUse[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Housing
  for (i = 0; i < treatmentIssues.housing.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.housing[i].goalid;
    const goals = treatmentIssues.housing[i].goals;
    const plans = treatmentIssues.housing[i].plans;
    const strategies = treatmentIssues.housing[i].strategies;
    const targetDate = treatmentIssues.housing[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Income/Financial/Legal
  for (i = 0; i < treatmentIssues.incomeLegal.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.incomeLegal[i].goalid;
    const goals = treatmentIssues.incomeLegal[i].goals;
    const plans = treatmentIssues.incomeLegal[i].plans;
    const strategies = treatmentIssues.incomeLegal[i].strategies;
    const targetDate = treatmentIssues.incomeLegal[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Relationships
  for (i = 0; i < treatmentIssues.relationships.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.relationships[i].goalid;
    const goals = treatmentIssues.relationships[i].goals;
    const plans = treatmentIssues.relationships[i].plans;
    const strategies = treatmentIssues.relationships[i].strategies;
    const targetDate = treatmentIssues.relationships[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Education
  for (i = 0; i < treatmentIssues.education.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.education[i].goalid;
    const goals = treatmentIssues.education[i].goals;
    const plans = treatmentIssues.education[i].plans;
    const strategies = treatmentIssues.education[i].strategies;
    const targetDate = treatmentIssues.education[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Benefits/MedicAid/Snap
  for (i = 0; i < treatmentIssues.benefits.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.benefits[i].goalid;
    const goals = treatmentIssues.benefits[i].goals;
    const plans = treatmentIssues.benefits[i].plans;
    const strategies = treatmentIssues.benefits[i].strategies;
    const targetDate = treatmentIssues.benefits[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
};

const headers = (initialTreatmentObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, initialTreatmentObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const treatmentGoals = (treatmentGoalObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentIssues.UpdateTreatmentGoals, treatmentGoalObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const treatmentPlans = (treatmentPlanObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentIssues.UpdateTreatmentPlans, treatmentPlanObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (initialTreatmentObj, req) {
  try {
    await updateTreatment(req);
    await headers(initialTreatmentObj);
    const updateStatement = console.log('Successfully updated TreatmentIssues');
    return updateStatement;
  } catch (error) {
    console.log(error);
  }
};
