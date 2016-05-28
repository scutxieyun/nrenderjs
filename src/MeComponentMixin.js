define("MeComponentMixin",function(){
	/**��Page���*/
	/** ����display�Ŀ��ǣ�
		displayֻ���ṩһ����Ϣ�ο������Ӱ��ؼ�����ʾ�����ϲ�ؼ��������������ϲ�ؼ�ȥ���ǳ�ͻ����
	**/
var selfIncCounter = 0;

	return {
		pageInstance:null,
		getIncId:function(){
				return selfIncCounter ++;
			},
		getInitialState:function(){
			return {
				display:true
			};//React�Ὣ����chain�е����ݽ��кϲ�
		},
		componentWillMount:function(){
			if(this.props.displayType == 1) 
				this.setState({display:false});
			if(this.props.id == undefined && this.props.autoActive){  //autoActive˵�����Ԫ����Ҫע��pageActive
				this._cid = "MeComponentMixin" + this.getIncId();
			}
		},
		componentDidMount:function(){
			//if(this.props.display != )
			var cId = this.props.id != undefined ? this.props.id : this._cid;
			if(this.props.pageIdx != undefined && cId != undefined){//ֻ�ж�����id������Ҫע��
				
				this.pageInstance = this.props.cxt.pageMgr.registerComponent(this.props.pageIdx,cId,this);	//�Ǽ����
			}
		},
		getPageInstance:function(){
			if(this.pageInstance != null) return this.pageInstance;
			if(this.props.pageIdx != undefined){
				return this.props.cxt.pageMgr.getPageInstance(this.props.pageIdx);
			}
			return null;
		},
		show:function(){
			this.setState({display:true});
		},
		hide:function(){
			this.setState({dislay:false});
		},
		addClass:function(str){
		}
	};
});