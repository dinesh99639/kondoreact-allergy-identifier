import { useState, useEffect, useContext } from 'react';

import {getUserByEmail} from '../../services/userdata'
import { updateGroup } from '../../services/group';
import NotificationContext from '../../context/NotificationContext';


import { Dialog } from '@progress/kendo-react-dialogs';
import { Chip, Button } from '@progress/kendo-react-buttons';
import { Card } from '@progress/kendo-react-layout';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';


const UpdateGroup = ({ visible, setVisible, title, selectedId,selectedGroup, groups }) => {
    const [data, setData] = useState([]);
    const [groupname, setGroupName] = useState();
    const [saveButtonVisibility, setSaveButtonVisibility] = useState(false);
    const [error, setError] = useState('')
    const [inputValue, setInputValue] = useState('');

  const { showNotification } = useContext(NotificationContext);


    useEffect(() => {
        const tempData = [];
        if (selectedId) {
            groups.groups.forEach(group => {
                if (group.id === selectedId) {
                    group?.accepted.forEach(el => {
                        tempData.push({ class: 'base', name: el.email })
                    })
                }
            });
            setData(tempData);
        }
        else {

        }
    }, [selectedId]);

    useEffect(() => {
        let flag = false;
        if (data) {
          data.forEach((el) => {
            if (el.class !== 'base') {
              flag = true;
            }
          });
        }
        setSaveButtonVisibility(flag);
      }, [data]);

    const handleChipRemove = (name) => {
        const dummyData = [...data];
        let indexToBeRemoved = -1;
        dummyData.forEach((el, idx) => {
            if (el.name === name) {
                if (el.class === 'error') {
                    el.class = 'base';
                } else if (el.class === 'success') {
                    indexToBeRemoved = idx;
                } else {
                    el.class = 'error';
                }
            }
        });
        if (indexToBeRemoved !== -1) {
            dummyData.splice(indexToBeRemoved, 1);
        }
        setData(dummyData);
    };

    const handleInputChange = (ev) =>{
        const value = ev.target.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setInputValue(value);
        if(value && !emailRegex.test(value)) {
            setError('Invalid Email Format.')
        }
        else {
            setError('');
        }
    };

    const handleAddUser = async () => {
        const el = data.find(
          (el) =>
            el.name.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
        );
        if (el) {
          setInputValue('');
          return;
        }
        if(selectedId) {
            let flag;
            groups.groups.forEach((group)=>{
                if(group.id === selectedId) {
                    flag=group.pending.find(el => el.email === inputValue)
                }});
            if(!!flag){
                 showNotification({ type: 'error', message: 'request is already sent' });
                setInputValue('');
                return;
            }
        }
        if (inputValue) {
        const res = await (await getUserByEmail(inputValue)).json();
        if(res?.total === 1 ) {
            setData(prev => [...prev, {class:"success", name: res?.results[0].email, id:res?.results[0].id}]);
        }
        else {
            showNotification({ type: 'error', message: 'user does not exist' });
        }
        }
        setInputValue('');
      };
    
      const handleSave = () => {
        let tempData = [];
        const deletedData = [];
        const addedData =[];
        data.forEach((el) => {
            if(el.class==="base") {
            tempData.push(el.name);
            }
          else if (el.class === 'error') {
            deletedData.push(el.name);
          }
          else {
            tempData.push(el.name);
            addedData.push({'id':el.id});
          }
        });
        if(selectedId) {
            let tempGrp = [];
            groups.groups.forEach((group)=>{
                if(group.id === selectedId) {
                    tempGrp = group.accepted.filter(member => !(deletedData.includes(member.email)));
                    group.accepted = tempGrp;
                    group.pending=  group.pending.concat(addedData);
                    updateGroup(group)
                    .then(res=>{
                        console.log(res);
                    })
                    .catch(err=>{
                        showNotification({ type: 'error', message: err.message });
                    })
                };
            });
            
        }
      };

    return <Dialog title={title} onClose={()=>{setVisible(!visible)}}>
        <div style={{ margin: '25px', textAlign: 'center' }}>
            {!selectedGroup && <Input placeholder='Group name' onChange={(ev)=>{setGroupName(ev.target.value)}} value={groupname}/>}
            <Card id='chips' className='chip-container'>
                <div style={(!data || data.length === 0) ? { margin: 'auto' } : undefined}>
                    {data && data.map(el => {
                        return <Chip removable={true}
                            key={el.name} text={el.name} value={el.name}
                            size="medium" themeColor={el.class}
                            onRemove={() => { handleChipRemove(el.name) }} />
                    })}
                    {(!data || data.length === 0) && <span>No Members</span>}
                </div>
            </Card>
           <Input placeholder='Email Id' onChange={handleInputChange} value={inputValue}/>
           <Error style={{ minHeight: '18px', margin: '5px' }}>
                       {error}
                     </Error>
        </div>
        <div className="button-container">
            <Button type="button" disabled={!inputValue || error } onClick={handleAddUser}>
                Add
            </Button>
            { saveButtonVisibility && <Button type="button" disabled={!selectedGroup && !groupname} onClick={handleSave}>
                Save
            </Button>}
        </div>
    </Dialog>
};

export default UpdateGroup;
