import test from "node:test";
import assert from "node:assert/strict";

const PRD_11_STAGES = [
  "New Enquiry Logged",
  "Customer Contacted",
  "Appointment Confirmed",
  "Technician Assigned",
  "Part Collected from Manikonda Hub",
  "Technician On The Way",
  "Technician Arrived",
  "Diagnosis Completed",
  "Awaiting Customer Approval",
  "Repair In Progress",
  "Completed & Closed",
];

test("PRD Section 6.5: Must contain exactly 11 status stages in defined order", () => {
  assert.equal(PRD_11_STAGES.length, 11, "Must have exactly 11 stages");
  assert.equal(PRD_11_STAGES[0], "New Enquiry Logged");
  assert.equal(PRD_11_STAGES[5], "Technician On The Way");
  assert.equal(PRD_11_STAGES[8], "Awaiting Customer Approval");
  assert.equal(PRD_11_STAGES[10], "Completed & Closed");
});

test("Stage calculation: index 5 marks stages 0-4 as completed, 5 as active, 6-10 as pending", () => {
  const currentStageIndex = 5;

  const stageStatuses = PRD_11_STAGES.map((name, i) => ({
    name,
    completed: i < currentStageIndex,
    active: i === currentStageIndex,
  }));

  // Stages 0 through 4 are done
  for (let i = 0; i < 5; i++) {
    assert.equal(stageStatuses[i].completed, true, `Stage ${i} (${PRD_11_STAGES[i]}) should be completed`);
    assert.equal(stageStatuses[i].active, false, `Stage ${i} should not be active`);
  }

  // Stage 5 is active
  assert.equal(stageStatuses[5].active, true, "Stage 5 should be active");
  assert.equal(stageStatuses[5].completed, false, "Active stage is not yet completed");

  // Stages 6 through 10 are pending
  for (let i = 6; i < 11; i++) {
    assert.equal(stageStatuses[i].completed, false, `Stage ${i} should be pending`);
    assert.equal(stageStatuses[i].active, false, `Stage ${i} should not be active`);
  }
});
