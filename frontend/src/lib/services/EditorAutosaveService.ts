import type { Contribution } from "$lib/models/Contribution";
import { strapiService } from "./StrapiService";

type EditorState = Contribution;

export type ErrorCallback = (err:any) => void;
export type AutosaveTasksCompletedCallback = () => void;

async function sleep(millis: number): Promise<void>{
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), millis);
    });
}

class EditorAutoSaveService{
    private states: EditorState[] = [];

    private isRunning = false;
    private _errorCallback: ErrorCallback|null = null;
    private _autosaveTasksCompletedCallback: AutosaveTasksCompletedCallback|null = null;

    public addState(state:EditorState){
        this.states.push(state);
    
        this.sendStates();
    }

    set errorCallback(errorCallback: ErrorCallback){
        this._errorCallback = errorCallback;
    }

    set autosaveTasksCompletedCallback(autosaveTasksCompletedCallback: AutosaveTasksCompletedCallback){
        this._autosaveTasksCompletedCallback = autosaveTasksCompletedCallback;
    }

    get isUpToDate():boolean{
        return !this.isRunning;
    }

    private async sendStates(){
        if(this.isRunning){
            return;
        }

        this.isRunning = true;

        while(this.states.length > 0){
            await sleep(250);
            
            const stateToSave = this.states.pop() as EditorState;
            this.states = [];
            
            try{
                await strapiService.updateContribution({ id: stateToSave.id, text: stateToSave.text }) 
            }catch(e:any){
                console.error(e);
                if(this._errorCallback){
                    this._errorCallback(e);
                }
            }
        }

        this.isRunning = false;

        if(this._autosaveTasksCompletedCallback){
            this._autosaveTasksCompletedCallback();
        }
    }
}

export const editorAutosaveService = new EditorAutoSaveService();