

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Case, QueryResult, Table, SavedGame } from './types';
import { generateMurderCase, translateCaseContent, translateTableData } from './services/geminiService';
import CaseBriefing from './components/CaseBriefing';
import SchemaViewer from './components/SchemaViewer';
import SQLTerminal from './components/SQLTerminal';
import StatusIndicator from './components/StatusIndicator';
import { PlayIcon, SkullIcon } from './components/icons/Icons';
import IconButton from './components/IconButton';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import CommandHistory from './components/CommandHistory';
import SavedCases from './components/SavedCases';
import SaveGameModal from './components/SaveGameModal';


declare var alasql: any;

const STORAGE_KEY = 'sql-murder-mystery-saved-games';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentQuery, setCurrentQuery] = useState('SELECT * FROM suspects;');
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { t, language } = useLanguage();
  const prevLangRef = useRef(language);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedGames(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load saved games from localStorage", error);
      setSavedGames([]);
    }
  }, []);
  
  // Effect to handle live translation of an active case
  useEffect(() => {
    const translateActiveCase = async () => {
      if (prevLangRef.current === language || !currentCase) {
        return;
      }

      setIsTranslating(true);
      try {
        const translatableContent = {
          title: currentCase.title,
          story: currentCase.story,
          resolution: currentCase.resolution,
          tables: currentCase.tables.map(t => ({ name: t.name, description: t.description })),
        };

        const translatedContent = await translateCaseContent(translatableContent, language);

        setCurrentCase(prevCase => {
          if (!prevCase) return null;

          const translatedDescriptionsMap = new Map(
            translatedContent.tables.map(t => [t.name, t.description])
          );

          const updatedTables = prevCase.tables.map(table => ({
            ...table,
            description: translatedDescriptionsMap.get(table.name) || table.description,
          }));

          return {
            ...prevCase,
            title: translatedContent.title,
            story: translatedContent.story,
            resolution: translatedContent.resolution,
            tables: updatedTables,
          };
        });

      } catch (error) {
        console.error("Failed to translate case content:", error);
        // For now, we just log the error. A user-facing notification could be added here.
      } finally {
        setIsTranslating(false);
      }
    };

    translateActiveCase();
    prevLangRef.current = language;
  }, [language, currentCase]);


  const resetGame = useCallback(() => {
    setGameState(GameState.INITIAL);
    setCurrentCase(null);
    setQueryHistory([]);
    setErrorMessage('');
    setCurrentQuery('SELECT * FROM suspects;');
    if (alasql && alasql.tables) {
      // Drop all existing tables dynamically and robustly
      Object.keys(alasql.tables).forEach(tableName => {
        alasql(`DROP TABLE IF EXISTS ${tableName}`);
      });
    }
  }, []);

  const startNewCase = useCallback(async () => {
    resetGame();
    setGameState(GameState.GENERATING);
    try {
      const newCase = await generateMurderCase(language);
      setCurrentCase(newCase);
      
      newCase.tables.forEach(table => {
        const columnDefs = Object.keys(table.schema).map(colName => `\`${colName}\``).join(',');
        alasql(`DROP TABLE IF EXISTS ${table.name}`);
        alasql(`CREATE TABLE ${table.name} (${columnDefs})`);
        if (table.data && table.data.length > 0) {
            alasql(`INSERT INTO ${table.name} SELECT * FROM ?`, [table.data]);
        }
      });

      setGameState(GameState.INVESTIGATING);
    } catch (error) {
      console.error("Failed to generate case:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setGameState(GameState.ERROR);
    }
  }, [language, resetGame]);

  const handleRunQuery = async () => {
    if (!currentCase || !currentQuery.trim()) return;

    const lowerCaseQuery = currentQuery.trim().toLowerCase();
    const resultId = Date.now().toString();
    
    if (lowerCaseQuery.startsWith('insert into solution')) {
        try {
            alasql(currentQuery);
            const userSolution = alasql('SELECT * FROM solution');
            if (userSolution.length > 0) {
                const lastSubmission = userSolution[userSolution.length - 1];
                const submittedKiller = Object.values(lastSubmission)[0] as string;

                if (submittedKiller?.trim().toLowerCase() === currentCase.solution.killer.trim().toLowerCase()) {
                    setGameState(GameState.SOLVED);
                } else {
                    setGameState(GameState.FAILED);
                }
            }
             setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, isSolutionAttempt: true }]);
        } catch (e: any) {
            setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, error: e.message, isSolutionAttempt: true }]);
        }
    } else if (lowerCaseQuery.startsWith('select')) {
        try {
            const data = alasql(currentQuery);
            const newResult: QueryResult = { id: resultId, query: currentQuery, data };

            setQueryHistory(prev => [...prev, newResult]);
            
            // If in Spanish mode, trigger on-the-fly translation of results
            if (language === 'es' && data && data.length > 0) {
                setQueryHistory(prev => prev.map(r => r.id === resultId ? { ...r, isTranslating: true } : r));
                
                translateTableData(data, language).then(translatedData => {
                    setQueryHistory(prevHistory => 
                        prevHistory.map(res => 
                            res.id === resultId 
                                ? { ...res, translatedData, isTranslating: false } 
                                : res
                        )
                    );
                }).catch(error => {
                    console.error("Failed to translate query data:", error);
                    setQueryHistory(prevHistory => 
                        prevHistory.map(res => 
                            res.id === resultId 
                                ? { ...res, error: t('translationError'), isTranslating: false } 
                                : res
                        )
                    );
                });
            }

        } catch (e: any) {
            setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, error: e.message }]);
        }
    } else if (lowerCaseQuery.startsWith('delete from solution')) {
        try {
            alasql(currentQuery);
            setGameState(GameState.INVESTIGATING); // Go back to investigating state
            setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, data: [{ status: t('solutionCleared') }] }]);
        } catch (e: any) {
             setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, error: e.message }]);
        }
    }
    else {
        setQueryHistory(prev => [...prev, { id: resultId, query: currentQuery, error: t('queryNotAllowedSimple') }]);
    }
    setCurrentQuery('');
  };

  const handleSaveGame = () => {
    if (!currentCase) return;
    const newSave: SavedGame = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        case: currentCase,
        queryHistory,
    };
    const updatedGames = [newSave, ...savedGames.slice(0, 9)]; // Keep up to 10 saves
    setSavedGames(updatedGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
    setIsSaveModalOpen(false);
    resetGame();
  };
  
  const handleLoadGame = (gameId: string) => {
    const gameToLoad = savedGames.find(g => g.id === gameId);
    if (!gameToLoad) return;
  
    resetGame();
  
    setTimeout(() => {
        setCurrentCase(gameToLoad.case);
        setQueryHistory(gameToLoad.queryHistory);
    
        gameToLoad.case.tables.forEach(table => {
          const columnDefs = Object.keys(table.schema).map(colName => `\`${colName}\``).join(',');
          alasql(`DROP TABLE IF EXISTS ${table.name}`);
          alasql(`CREATE TABLE ${table.name} (${columnDefs})`);
          if (table.data && table.data.length > 0) {
              alasql(`INSERT INTO ${table.name} SELECT * FROM ?`, [table.data]);
          }
        });
    
        setGameState(GameState.INVESTIGATING);
    }, 0);
  };
  
  const handleDeleteGame = (gameId: string) => {
    const updatedGames = savedGames.filter(g => g.id !== gameId);
    setSavedGames(updatedGames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
  };


  const renderGameState = () => {
    switch (gameState) {
      case GameState.GENERATING:
        return <StatusIndicator message={t('generatingCase')} />;
      case GameState.ERROR:
        return (
          <StatusIndicator
            message={`Error: ${errorMessage}`}
            isError={true}
            onRetry={startNewCase}
          />
        );
      case GameState.INVESTIGATING:
      case GameState.FAILED:
        if (!currentCase) return null;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 h-full">
            <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
              <CaseBriefing title={currentCase.title} story={currentCase.story} />
              <SchemaViewer tables={currentCase.tables} />
               {gameState === GameState.FAILED && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg animate-pulse">
                    <h3 className="font-bold text-lg">{t('incorrectSolutionTitle')}</h3>
                    <p>{t('incorrectSolutionBody')}</p>
                </div>
              )}
            </div>
            <div className="lg:col-span-8 h-full flex flex-col lg:flex-row gap-4 min-h-0">
                <div className="h-1/2 lg:h-full flex-grow lg:w-2/3 min-h-0">
                    <SQLTerminal 
                        onRunQuery={handleRunQuery} 
                        history={queryHistory}
                        query={currentQuery}
                        setQuery={setCurrentQuery}
                    />
                </div>
                <div className="h-1/2 lg:h-full lg:w-1/3 min-h-0">
                    <CommandHistory history={queryHistory} onCommandSelect={setCurrentQuery} />
                </div>
            </div>
          </div>
        );
      case GameState.SOLVED:
         if (!currentCase) return null;
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
                <h1 className="text-4xl font-bold text-amber-400 mb-4">{t('caseSolved')}</h1>
                <p className="text-xl mb-6 max-w-3xl">{currentCase.resolution}</p>
                <p className="text-lg font-semibold mb-8">You correctly identified <span className="text-green-400">{currentCase.solution.killer}</span> as the killer.</p>
                <IconButton text={t('newCase')} icon={<PlayIcon />} onClick={startNewCase} />
            </div>
        )
      case GameState.INITIAL:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
            <SkullIcon className="w-24 h-24 text-slate-500 mb-4" />
            <h1 className="text-5xl font-bold mb-2">{t('initialTitle')}</h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl">{t('initialDescription')}</p>
            <IconButton text={t('startInvestigation')} icon={<PlayIcon />} onClick={startNewCase} />
            <SavedCases cases={savedGames} onLoad={handleLoadGame} onDelete={handleDeleteGame} />
          </div>
        );
    }
  };

  return (
    <main className="bg-slate-900 text-slate-300 min-h-screen h-screen font-sans flex flex-col">
      <header className="flex items-center justify-between p-4 bg-slate-950/70 border-b border-slate-700 shadow-lg">
        <h1 className="text-xl font-bold text-amber-300 tracking-wider">{t('sqlDetectiveAgency')}</h1>
        <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {gameState !== GameState.INITIAL && gameState !== GameState.GENERATING && (
                 <button onClick={() => setIsSaveModalOpen(true)} className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-md transition-colors">
                    {t('mainMenu')}
                 </button>
            )}
        </div>
      </header>
      <div className="flex-grow overflow-hidden relative">
        {renderGameState()}
        {isTranslating && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-50 backdrop-blur-sm">
                <StatusIndicator message={t('translatingCase')} />
            </div>
        )}
      </div>
      {isSaveModalOpen && (
        <SaveGameModal 
            onSave={handleSaveGame}
            onExit={() => {
                setIsSaveModalOpen(false);
                resetGame();
            }}
            onCancel={() => setIsSaveModalOpen(false)}
        />
      )}
    </main>
  );
};

export default App;