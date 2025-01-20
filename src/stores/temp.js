export const importCustomFunctions = (file, store) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      if (!Array.isArray(data)) {
        throw new Error("Invalid file format: Expected an array of custom functions.");
      }

      data.forEach((func) => {
        validateCustomFunction(func); // Custom validation logic
        store.addCustomFunction(func); // Add to store
      });
    } catch (error) {
      console.error("Error importing custom functions:", error.message);
    }
  };

  reader.readAsText(file);
};

const validateCustomFunction = (func) => {
  if (!func.metadata || !func.definition) {
    throw new Error("Invalid function format: Missing metadata or definition.");
  }
  // Add further validation as needed
};


<input type="file" accept=".json" onchange="handleFileUpload(event)" />
<script>
function handleFileUpload(event) {
  const file = event.target.files[0];
  importCustomFunctions(file, useCustomFunctionStore());
}
</script>
