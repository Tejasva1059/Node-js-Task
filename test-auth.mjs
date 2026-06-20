import('./scripts/test-auth.mjs').catch(err => {
  console.error('Failed to run tests:', err);
  process.exit(1);
});
