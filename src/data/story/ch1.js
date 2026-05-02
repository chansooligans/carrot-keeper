// Chapter 1 quest hints. The HUD reads currentQuestHint(state) for the line.

export function currentQuestHint(state) {
  const f = state.flags;
  const inv = state.inv;
  if (!f.intro_done) return 'Talk to Hazel.';
  if (!f.mayor_quest_started) return 'Find Mayor Burrows.';
  if (!f.invited_pip) return 'Invite Pip.';
  if (!f.invited_thump) return 'Invite Old Thump.';
  if (!f.invited_mossfoot) return "Invite Mrs. Mossfoot.";
  if (f.bunny_quest_started && !f.has_baby && !f.bunny_returned) return 'Find the baby. (Windmill?)';
  if (f.has_baby) return 'Bring the baby home.';
  if (!f.festival_ready) return 'See the Mayor again.';
  if (!f.festival_done) return 'Go to the Festival square.';
  if (!f.handoff_done) return 'To the forest path!';
  return '';
}
