import React from 'react';
import ImagePreviewLayout from './ImageData_PreviewLayout';
import ReportRepository from './../../repositories/ReportRepository';
import Api from './../../utils/Api';
import FileUpload from 'react-fileupload';
import ModalViewTableCreate from './ModalViewTableCreate';
import ModalViewLabelCreate from './ModalViewLabelCreate';
import ModalViewFormatCreate from './ModalViewFormatCreate';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

export default class ImagesConfigurationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
                imagePaths : null,
                networkId : "nn0000091",
                databaseName : null,
                tableName : null,
                labelName : null,
                formAction : null,
                uploadFileList : [],
                rate : 0,
                selModalView : null,
                tableSelectList : null,
                xSize : null,
                ySize : null,
                formatData : {},
                baseDom : null,
                tableDom : null,
                domSizeX : null, 
                domSizeY : null
                };
    }

    //when page called on first 
    componentDidMount(){
        this.initDataBaseLov()
        
    }

    // 
    initDataBaseLov(){
        this.props.reportRepository.getNetBaseInfo(this.state.networkId).then((nnBaseInfo) => {
            let base = nnBaseInfo['result'][0]['fields']['dir'];
            let table = nnBaseInfo['result'][0]['fields']['table'];   

            if(base == null || base == ''){
                let base=<select onChange={this.setDatabaseName.bind(this)} value={this.state.value}>
                                <option value="1">Data Base List</option>
                                <option value="mes">MES</option>
                                <option value="scm">SCM</option>
                                <option value="erp">ERP</option>
                            </select>
            }
            
            if(table == null && table == ''){
                table = <input type="text" name="table" placeholder="table" 
                                            onChange={this.setTableName.bind(this)} value={this.state.value} />
            }
            this.setState({baseDom : base});
            this.setState({tableDom : table});
            this.initTableLov(base, table);
        });
    }

    // init table lov
    initTableLov(base, table){

        let requestUrl = "base/" + base + "/table/" + table + "/format/" + this.state.networkId + "/";
            this.props.reportRepository.getImageFormatData(requestUrl, "").then((format) => {
                let formatData = format['result']
                let xSize = formatData['x_size'];
                let ySize = formatData['y_size'];

                if(xSize == null || xSize == ''){
                    xSize = <input type="text" name="xsize" placeholder="xsize" 
                                            onChange={this.setXSize.bind(this)} value={this.state.xSize} />   
                } 

                if(ySize == null || ySize == ''){
                    ySize= <input type="text" name="ysize" placeholder="ysize" 
                                            onChange={this.setYSize.bind(this)} value={this.state.ySize} />
                }
                this.setState({domSizeX : xSize})
                this.setState({domSizeY : ySize})    
            });       
    }

    // on Search button event occurs 
    searchBtn(nnid){
        this.props.reportRepository.getPreviewImagePath(this.state.networkId).then((previewPaths) => {
            this.setState({imagePaths: previewPaths['result']})
        });
    }

    // on Search button event occurs 
    getTableList(){
        let requestUrl = "base/" + this.state.databaseName + "/table/";
        this.props.reportRepository.getTableList(requestUrl).then((tableList) => {
            let rows = [];
            let i=0;
            rows.push(<option value="1">Table List</option>)
            for (let tableName of tableList['result']){
                rows.push(<option key={i++} value={tableName}>{tableName}</option>)
            }

            this.setState({tableSelectList : rows});
        });
    }

    // get format data 
    getFormatData(){
        let requestUrl = "base/" + this.state.databaseName + "/table/" + this.state.tableName + "/format/" + this.state.networkId + "/";
        this.props.reportRepository.getImageFormatData(requestUrl, "").then((format) => {
            let formatData = format['result']
            this.setState({xSize : formatData['x_size']})
            this.setState({ySize : formatData['y_size']})
        });
    }

    // on database name changed 
    setDatabaseName(obj){
        this.setState({databaseName : obj.target.value}, function(){ 
            this.getTableList()
        });
    }

    // on tab name changed
    setTableName(obj){
        this.setState({tableName: obj.target.value}, function(){ 
            this.getFormatData()
        });
    }
    // on label name
    setXSize(obj){
        this.setState({xSize: obj.target.value});
    }
    
    // on label name
    setYSize(obj){
        this.setState({ySize: obj.target.value});
    }

    //route modal view 
    openModal(type){
        console.log(type)
        if(type == 'table'){
            this.setState({selModalView : <ModalViewTableCreate/>})
        }
        else if(type == 'label'){
            this.setState({selModalView : <ModalViewLabelCreate networkId={this.state.networkId}/>})
        }
        else if(type == 'format'){
            this.setState({selModalView : <ModalViewFormatCreate formatData={this.state} />})
        }
        this.setState({open: true})
    }

    // close modal 
    closeModal () { this.setState({open: false}); }

    render() {
        return (
            <div className="container tabBody">
                <div id="tab1">
                    <article>
                        <table className="form-table align-left">
                            <colgroup>
                            <col width="40" />
                            <col width="40" />
                            <col width="40" />
                            <col width="40" />
                            <col width="40" />
                            <col width="40" />
                            <col width="60" />
                            <col width="100" />
                            <col width="250" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>Network ID</th>
                                    <td width>{this.state.networkId}</td>
                                    <th>*DataBase</th>
                                    <td width>
                                        {this.state.baseDom}
                                    </td>
                                    <th>*Table</th>
                                    <td width>
                                        {this.state.tableDom}
                                    </td>
                                    <th>*Format</th>
                                    <td width>
                                        <p>{this.state.domSizeX} x {this.state.domSizeY}</p>
                                    </td>
                                    <td width>
                                        <button onClick={this.openModal.bind(this ,'format')}>SET</button>
                                        <button onClick={this.openModal.bind(this ,'table')}>table</button>
                                        <button onClick={this.openModal.bind(this ,'label')}>label</button>
                                        <button type="button" onClick={() => this.searchBtn()} className="img-btn save">Search</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <Modal
                            className="modal"
                            overlayClassName="modal"
                            isOpen={this.state.open}
                            onRequestClose={this.closeModal}>
                            {this.state.selModalView}
                            <button onClick={this.closeModal}>Close</button>
                        </Modal>
                        
                        <div className="img-box-wrap">
                            <ImagePreviewLayout imageDataSet={this.state}/>
                        </div>
                    </article>
                </div>
            </div>
        )
    }
}

ImagesConfigurationComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};