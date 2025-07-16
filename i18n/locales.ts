

export const translations = {
  en: {
    // Header
    sqlDetectiveAgency: "SQL Detective Agency",
    mainMenu: "Main Menu",
    
    // Initial Screen
    initialTitle: "SQL Murder Mystery",
    initialDescription: "A new case has gone cold. Only you can crack it. Use your SQL skills to query the database, uncover clues, and bring the killer to justice.",
    startInvestigation: "Start New Investigation",
    
    // Status Indicator
    generatingCase: "Generating a new case file from the archives...",
    tryAgain: "Try Again",
    
    // Solved Screen
    caseSolved: "Case Solved!",
    newCase: "Start New Case",
    
    // Investigating Screen
    incorrectSolutionTitle: "Incorrect Solution",
    incorrectSolutionBody: "Your theory is flawed. The evidence doesn't add up. Clear the `solution` table with `DELETE FROM solution` and re-examine the clues.",
    databaseSchema: "Database Schema",
    
    // SQL Terminal
    welcomeMessage: "Welcome, Detective. Use SQL to investigate. Good luck.",
    runQuery: "Run Query",
    queryPlaceholder: "Enter your SQL query here...",
    solutionAttempt: "Attempting to solve the case...",
    noRowsReturned: "Query executed successfully. No rows returned.",
    queryNotAllowed: "Query not allowed. Only SELECT statements are permitted.",
    queryNotAllowedSimple: "Query not allowed. Only SELECT, INSERT INTO solution, and DELETE FROM solution statements are permitted.",
    solutionCleared: "Solution cleared. You can now try again.",

    // Command History
    commandHistory: "Command History",

    // Save/Load
    savedCasesTitle: "Saved Cases",
    loadCase: "Load Case",
    deleteCase: "Delete",
    emptyCaseSlot: "No saved cases found. Start an investigation to save your progress.",
    saveGameTitle: "Save Progress?",
    saveGamePrompt: "Do you want to save your current case before returning to the main menu?",
    saveAndExit: "Save and Exit",
    exitWithoutSaving: "Exit Without Saving",
    cancel: "Cancel",
    
    // Translation
    translatingCase: "Translating case file...",
    translationError: "Failed to translate content.",
    translatingResults: "Translating results...",
  },
  es: {
    // Header
    sqlDetectiveAgency: "Agencia de Detectives SQL",
    mainMenu: "Menú Principal",

    // Initial Screen
    initialTitle: "Misterio de Asesinato SQL",
    initialDescription: "Un nuevo caso se ha enfriado. Solo tú puedes resolverlo. Usa tus habilidades de SQL para consultar la base de datos, descubrir pistas y llevar al asesino ante la justicia.",
    startInvestigation: "Iniciar Nueva Investigación",

    // Status Indicator
    generatingCase: "Generando un nuevo archivo de caso desde los archivos...",
    tryAgain: "Intentar de Nuevo",

    // Solved Screen
    caseSolved: "¡Caso Resuelto!",
    newCase: "Empezar Nuevo Caso",

    // Investigating Screen
    incorrectSolutionTitle: "Solución Incorrecta",
    incorrectSolutionBody: "Tu teoría es errónea. La evidencia no cuadra. Limpia la tabla `solution` con `DELETE FROM solution` y reexamina las pistas.",
    databaseSchema: "Esquema de la Base de Datos",

    // SQL Terminal
    welcomeMessage: "Bienvenido, Detective. Usa SQL para investigar. Buena suerte.",
    runQuery: "Ejecutar Consulta",
    queryPlaceholder: "Introduce tu consulta SQL aquí...",
    solutionAttempt: "Intentando resolver el caso...",
    noRowsReturned: "Consulta ejecutada con éxito. No se devolvieron filas.",
    queryNotAllowed: "Consulta no permitida. Solo se permiten sentencias SELECT.",
    queryNotAllowedSimple: "Consulta no permitida. Solo se permiten sentencias SELECT, INSERT INTO solution y DELETE FROM solution.",
    solutionCleared: "Solución limpiada. Ahora puedes intentarlo de nuevo.",
    
    // Command History
    commandHistory: "Historial de Comandos",

    // Save/Load
    savedCasesTitle: "Casos Guardados",
    loadCase: "Cargar Caso",
    deleteCase: "Eliminar",
    emptyCaseSlot: "No se encontraron casos guardados. Inicia una investigación para guardar tu progreso.",
    saveGameTitle: "¿Guardar Progreso?",
    saveGamePrompt: "¿Quieres guardar tu caso actual antes de volver al menú principal?",
    saveAndExit: "Guardar y Salir",
    exitWithoutSaving: "Salir Sin Guardar",
    cancel: "Cancelar",
    
    // Translation
    translatingCase: "Traduciendo el archivo del caso...",
    translationError: "Error al traducir el contenido.",
    translatingResults: "Traduciendo resultados...",
  }
};

export type TranslationKey = keyof typeof translations.en;