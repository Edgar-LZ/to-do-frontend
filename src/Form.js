
import { useState } from 'react';
import { useContext } from 'react';
import { ToDoContext } from './ToDoList';

function SearchForm() {

    
    const {rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri}  = useContext(ToDoContext);

    const [search, setSearch] = useState('');
    const [priority, setPriority] = useState('All');
    const [status, setStatus] = useState('All');

    function handleClick(){
        setUrlParams(new URLSearchParams(
            {
                filterName: search,
                filterPriority: priority,
                filterDone:status,
            }
        ));

    }

    function handlePriorityChange(e) {
        setPriority(e.target.value);
    }
    function handleStatusChange(e) {
        setStatus(e.target.value);
    }
    function handleTextareaChange(e) {
        setSearch(e.target.value);
    }
    
    
    return (
        <div>
                <span>
                    <label>
                        Name:{''} <textarea value={search} onChange={handleTextareaChange} />
                    </label>
                </span>

                <span>
                    <label> Priority:{''}
                    <select className="dropdown" onChange={handlePriorityChange}>
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    </select>
                    </label>
                </span>
                
                <span>
                    <label> State:{''}
                    <select className="dropdown" onChange={handleStatusChange}>
                        <option value="All">All</option>
                        <option value="Done">Done</option>
                        <option value="Undone">Undone</option>
                    </select>
                    </label>
                    <button name="send" id="send" onClick={handleClick}> Submit  </button>
                </span>
        </div>
     );

}



export default SearchForm;
