function checkReactVersion(packageJsonCode) {
    try {
      const packageJson = JSON.parse(packageJsonCode);
      const dependencies = packageJson.dependencies || {};
  
      if (dependencies.react) {
        const reactVersion = dependencies.react;
        const caretIndex = reactVersion.indexOf('^');
  
        if (caretIndex !== -1) {
          const actualVersion = reactVersion.slice(caretIndex + 1);
          const versionNumbers = actualVersion.split('.').map(Number);
  
          if (
            versionNumbers[0] > 18 ||
            (versionNumbers[0] === 18 && versionNumbers[1] >= 0)
          ) {
            return true;
          } else return false;
        }
      } else {
        return 0
      }
    } catch (error) {
      console.error('Error parsing package.json:', error);
    }
  }

  module.exports = checkReactVersion;
