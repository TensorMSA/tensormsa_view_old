import React from 'react'
import ReportRepository from './../../repositories/ReportRepository';
import Api from './../../utils/Api';

export default class ModalViewTableCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                tableName : null,
                tableRows : null,
                databaseName : null               
                };
    }

    // override : call after render
    componentDidUpdate(preProps, prevState){
        //this.getTableList()
    }

    //get table list on seleceted base name
    getTableList(){
        let requestUrl = this.get_searchUrl();
        this.props.reportRepository.getTableList(requestUrl).then((table_list) => {
            let rows = [];
            let i=0;
            for (let tableName of table_list['result']){
                rows.push(<tr key={i++}><td>{tableName}</td></tr>)
            }

            this.setState({tableRows : rows})
        });
    }

    // add user request new table
    postTableName(){
        let requestUrl = this.get_add_url();
        this.props.reportRepository.postTableList(requestUrl, null).then((answer) => {
            this.getTableList()
        });;
    }

    //delete user request named table
    deleteTableName(){
        let requestUrl = this.get_delete_url();
        this.props.reportRepository.deleteTableList(requestUrl, null).then((answer) => {
            this.getTableList();
        });
    }

    //set table name on state variable
    setTableName(obj){
        this.setState({tableName: obj.target.value});
    }

    //set base name on state variable
    setDatabaseName(obj){
        this.setState({databaseName: obj.target.value});
    }

    // combine get rest api url 
    get_searchUrl(){
        return "base/" + this.state.databaseName + "/table/" ;
    }

    // combine post rest api url 
    get_add_url(){
        return "base/" + this.state.databaseName + "/table/" + this.state.tableName + "/";
    }

    // combine delete rest api url 
    get_delete_url(){
        return "base/" + this.state.databaseName + "/table/" + this.state.tableName + "/";
    }

    render() {
        return (   
            <div>
                <h1>Table Management</h1>
                
                <div className="container tabBody">
                    <div id="tab1">
                        <article>
                            <table className="form-table align-left">
                                <colgroup>
                                <col width="80" />
                                <col width="160" />
                                <col width="80" />
                                <col width="200" />
                                </colgroup> 
                                <tbody>
                                <tr>
                                    <th>Select</th>
                                    <td>
                                        <select onChange={this.setDatabaseName.bind(this)} value={this.state.value}>
                                            <option value="1">Data Base List</option>
                                            <option value="mes">MES</option>
                                            <option value="scm">SCM</option>
                                            <option value="erp">ERP</option>
                                        </select>
                                        <button type="button" onClick={this.getTableList.bind(this)}>Search</button>
                                    </td>
                                    <th>Modify</th>
                                    <td>
                                        <input type="text" name="tableName" placeholder="tableName" 
                                            onChange={this.setTableName.bind(this)} value={this.state.value} />
                                        <button type="button" onClick={this.postTableName.bind(this)}>Add</button>
                                        <button type="button" onClick={this.deleteTableName.bind(this)}>Delete</button>    
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table className="table marginT10">
                                <thead>
                                    <tr>
                                        <th>Table Name</th>
                                    </tr>
                                </thead>
                                <tbody className="center">      
                                    {this.state.tableRows}  
                                </tbody>
                            </table>
                        </article>
                    </div>
                </div>
            </div>
        )
    }
} 

ModalViewTableCreate.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};