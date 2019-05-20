import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Table,
  Divider,
  Modal,
  Comment,
  Avatar,
  Tooltip,
  Tag,
  notification
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {salaryArr, workYearArr, companySizeArr, financeStageArr} from '@/config/query';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

@connect((adminList) => ({adminList}))
class AddAdminForm extends PureComponent {
  state = {
    confirmDirty: false,
  }

  handleSubmit = e => {
    const { dispatch, form, handleChange } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'adminList/addAdmin',
          payload: {
            ...values
          }
        }).then((res) => {
          if (res.success) {
            notification.success({
              message: '操作成功',
            });
            form.resetFields();
            handleChange('ok');
          } else if (res.code === 1) {
            notification.error({
              message: '用户名或昵称已存在',
            });
            form.resetFields();
          } else {
            notification.error({
              message: '未知错误',
            });
            form.resetFields();
            handleChange('ok');
          }
        })
      }
    });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(!value.match(/^[0-9A-Za-z]{6,16}$/g)) {
      callback('密码格式不符要求!');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不同!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('nickName', {
            rules: [{ required: true, message: '请输入昵称' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="昵称"
            />,
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码（6-16位，字母与数字组合）" />)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请再次输入密码',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="确认密码" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择类型',
              }
            ],
          })(
          <Select prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="类型">
            <Option value="1">超级管理员</Option>
            <Option value="2">普通管理员</Option>
          </Select>)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            确定
          </Button>
          <Button style={{marginLeft: 10}} onClick={this.handleReset}>
            清空
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const AddAdminFormObj = Form.create({})(AddAdminForm);

@connect((adminList) => ({adminList}))
class ChangeAdminForm extends PureComponent {
  state = {
    confirmDirty: false,
  }

  handleSubmit = e => {
    const { dispatch, currId, form, handleChange } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'adminList/changeAdminPsw',
          payload: {
            currId,
            ...values
          }
        }).then((res) => {
          if (res.success) {
            notification.success({
              message: '操作成功',
            });
            form.resetFields();
            handleChange('ok');
          } else if (res.code === 1) {
            notification.error({
              message: '旧密码错误',
            });
            form.resetFields();
          } else {
            notification.error({
              message: '未知错误',
            });
            form.resetFields();
            handleChange('ok');
          }
        })
      }
    });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(!value.match(/^[0-9A-Za-z]{6,16}$/g)) {
      callback('密码格式不符要求!');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不同!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('old', {
            rules: [{ required: true, message: '请输入旧密码' }],
          })(
            <Input type="password"
              prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="旧密码"
            />,
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码（6-16位，字母与数字组合）" />)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请再次输入密码',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="确认密码" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            确定
          </Button>
          <Button style={{marginLeft: 10}} onClick={this.handleReset}>
            清空
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const ChangeAdminFormObj = Form.create({})(ChangeAdminForm);


/* eslint react/no-multi-comp:0 */
@connect(({ adminList, user, loading }) => ({
  user,
  adminList,
  loading: loading.models.rule,
}))
// @Form.create()
class AdminList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10,
    loading: false,
    addAdminModalVisible: false,
    changeAdminModalVisible: false,
    detail: {},
    currentUser: {}
  };

  columns = [
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type) => {
        let str = '';
        switch(type) {
          case 1:
            str = '超级管理员';
            break;
          case 2:
            str = '普通管理员';
            break;
          default:
            break;
        }
        return str
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => status === 1 ? '启用中' : '禁用中',
    },
    {
      title: '最后登录时间',
      dataIndex: 'latesetTime',
      render: (text) => moment(+text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={this.showChangeAdminModal.bind(this, record)}>修改密码</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleDisabled(record._id, record.status)}>{record.status === 1 ? '禁用' : '启用'}</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, user } = this.props;
    const { currentUser } = user;
    this.setState({
      currentUser: currentUser
    }, () => {
      dispatch({
        type: 'adminList/pageAdminList',
        payload: {
          pageNo: 1,
          pageSize: 10,
          query: {}
        }
      });
    });
  }

  handleDisabled = (id, status) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: 'adminList/changeAdminStatus',
      payload: {
        id,
        status
      }
    }).then(res => {
      if (res.success) {
        this.setState(
          { loading: false, visible: false },
          () => {
            notification.success({
              message: '操作成功',
            });
          }
        );
        const params = {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          query: this.state.formValues
        };
        dispatch({
          type: 'adminList/pageAdminList',
          payload: params,
        })
      } else {
        notification.error({
          message: '操作失败',
        });
      }
    });
  };

  showAddAdminModal = () => {
    const { dispatch, user } = this.props;
    console.log('user', user)
    this.setState({
      addAdminModalVisible: true,
    });
  };

  handleAddAdminModalOk = (e) => {
    console.log(e);
    this.setState({
      addAdminModalVisible: false,
    });
  };

  handleAddAdminModalCancel = (e) => {
    this.setState({ addAdminModalVisible: false });
  };

  handleAddAdminFormChange = (e) => {
    if (e) {
      this.setState({ addAdminModalVisible: false });
    }
  }

  showChangeAdminModal = (record) => {
    const { dispatch, user } = this.props;
    // console.log('record', record)
    this.setState({
      currId: record._id
    }, () => {
      this.setState({
        changeAdminModalVisible: true,
      });
    })
  };

  handleChangeAdminModalOk = (e) => {
    console.log(e);
    this.setState({
      changeAdminModalVisible: false,
    });
  };

  handleChangeAdminModalCancel = (e) => {
    this.setState({ changeAdminModalVisible: false });
  };

  handleChangeAdminFormChange = (e) => {
    if (e) {
      this.setState({ changeAdminModalVisible: false });
    }
  }

  changePage(current){
    this.setState({
      pageNo: current,
    });
    const { dispatch } = this.props;
    const params = {
      pageNo: current,
      pageSize: this.state.pageSize,
      query: this.state.formValues
    };
    dispatch({
      type: 'adminList/pageAdminList',
      payload: params,
    })
  }

  changePageSize(pageSize,current){
    this.setState({
      pageSize: pageSize,
    });
    const { dispatch } = this.props;
    const params = {
      pageNo: this.state.pageNo,
      pageSize: pageSize,
      query: this.state.formValues
    };
    dispatch({
      type: 'adminList/pageAdminList',
      payload: params,
    })
  }


  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const { adminList, user } = this.props;
    const { data } = adminList;
    const { currentUser } = user;
    const { addAdminModalVisible, changeAdminModalVisible, loading, detail, currId } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: () => `共${data.total}条`,
      pageSize: this.state.pageSize,
      current: data.pageNo,
      total: data.total,
      onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
      onChange: (current) => this.changePage(current),
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Modal
          title="新增管理员"
          visible={addAdminModalVisible}
          footer={null}
          // onOk={this.handleAddAdminModalOk}
          onCancel={this.handleAddAdminModalCancel}
        >
          <AddAdminFormObj handleChange={this.handleAddAdminFormChange.bind(this)}></AddAdminFormObj>
        </Modal>
        <Modal
          title="修改密码"
          visible={changeAdminModalVisible}
          footer={null}
          // onOk={this.handleAddAdminModalOk}
          onCancel={this.handleChangeAdminModalCancel}
        >
          <ChangeAdminFormObj handleChange={this.handleChangeAdminFormChange.bind(this)} currId={currId}></ChangeAdminFormObj>
        </Modal>
        {currentUser.type === 2
          ? <Card bordered={false} title="无权限"></Card>
          : <Card bordered={false} title="管理员列表" extra={<Button type="primary"><a href="javascript:;" onClick={this.showAddAdminModal}>新增</a></Button>}>
            <div className={styles.tableList}>
              <Table columns={this.columns} dataSource={data.data} pagination={paginationProps} />
            </div>
          </Card>
        }

      </PageHeaderWrapper>
    );
  }
}

export default AdminList;
