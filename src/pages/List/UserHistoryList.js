import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
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
  Tag
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

/* eslint react/no-multi-comp:0 */
@connect(({ userHistoryList, loading }) => ({
  userHistoryList,
  loading: loading.models.rule,
}))
@Form.create()
class UserHistoryList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10,
    loading: false,
    visible: false,
    detail: {}
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'jobs.positionId',
      width: 10
    },
    {
      title: '职位',
      dataIndex: 'jobs.name',
    },
    {
      title: '薪资',
      dataIndex: 'jobs.salary',
    },
    {
      title: '公司',
      dataIndex: 'jobs.companyName',
    },
    {
      title: '是否被清除',
      dataIndex: 'status',
      render: (status) => status === 1 ? '否' : '是',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      render: (text) => moment(+text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <Link to={`/list/jobDetail?id=${record.jobs._id}`}>查看详情</Link>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, location } = this.props;
    this.setState({
      currId: location.query.id,
      currName: location.query.name
    }, () => {
      dispatch({
        type: 'userHistoryList/pageUserHistoryListById',
        payload: {
          pageNo: 1,
          pageSize: 10,
          openId: this.state.currId,
          query: {}
        }
      });
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }, () => {
      const params = {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        openId: this.state.currId,
        query: this.state.formValues
      };
      dispatch({
        type: 'userHistoryList/pageUserHistoryListById',
        payload: params,
      })
    });
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      }, () => {
        const params = {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          openId: this.state.currId,
          query: this.state.formValues
        };
        dispatch({
          type: 'userHistoryList/pageUserHistoryListById',
          payload: params,
        })
      });
      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
    });
  };

  changePage(current){
    this.setState({
      pageNo: current,
    });
    const { dispatch } = this.props;
    const params = {
      pageNo: current,
      pageSize: this.state.pageSize,
      openId: this.state.currId,
      query: this.state.formValues
    };
    dispatch({
      type: 'userHistoryList/pageUserHistoryListById',
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
      openId: this.state.currId,
      query: this.state.formValues
    };
    dispatch({
      type: 'userHistoryList/pageUserHistoryListById',
      payload: params,
    })
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="ID">
              {getFieldDecorator('openId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="省份">
              {getFieldDecorator('province')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="Beijing">北京</Option>
                  <Option value="Tianjin">天津</Option>
                  <Option value="Hebei">河北</Option>
                  <Option value="Shanxi">山西</Option>
                  <Option value="Neimengu">内蒙古</Option>
                  <Option value="Liaoning">辽宁</Option>
                  <Option value="Jiling">吉林</Option>
                  <Option value="Heilongjiang">黑龙江</Option>
                  <Option value="Shanghai">上海</Option>
                  <Option value="Jiangsu">江苏</Option>
                  <Option value="Zhejiang">浙江</Option>
                  <Option value="Anhui">安徽</Option>
                  <Option value="Fujian">福建</Option>
                  <Option value="Jiangxi">江西</Option>
                  <Option value="Shandong">山东</Option>
                  <Option value="Henan">河南</Option>
                  <Option value="Hubei">湖北</Option>
                  <Option value="Hunan">湖南</Option>
                  <Option value="Guangdong">广东</Option>
                  <Option value="Guangxi">广西</Option>
                  <Option value="Hainan">海南</Option>
                  <Option value="Sichuan">四川</Option>
                  <Option value="Guizhou">贵州</Option>
                  <Option value="Yunnan">云南</Option>
                  <Option value="Chongqing">重庆</Option>
                  <Option value="Xizang">西藏</Option>
                  <Option value="Shaanxi">陕西</Option>
                  <Option value="Gansu">甘肃</Option>
                  <Option value="Qinghai">青海</Option>
                  <Option value="Ningxia">宁夏</Option>
                  <Option value="Xinjiang">新疆</Option>
                  <Option value="Hongkong">香港</Option>
                  <Option value="Macao">澳门</Option>
                  <Option value="Taiwan">台湾</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}></Col>
          <Col md={8} sm={24}></Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden', textAlign: 'right' }}>
              <div style={{ marginBottom: 24, display: 'inline-block'  }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a> */}
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const { userHistoryList, history } = this.props;
    const { data } = userHistoryList;
    const { visible, loading, detail, currId, currName } = this.state;
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
    const detailDiv = (
      <Form {...formItemLayout}>
        <Form.Item label="openId">{detail.openId}</Form.Item>
        <Form.Item label="appId">{detail.watermark && detail.watermark.appid}</Form.Item>
        <Form.Item label="昵称">{detail.nickName}</Form.Item>
        <Form.Item label="性别">{detail.gender === 1 ? '男': '女'}</Form.Item>
        <Form.Item label="国籍">{detail.country}</Form.Item>
        <Form.Item label="省份">{detail.province}</Form.Item>
        <Form.Item label="城市">{detail.city}</Form.Item>
        {/* <Form.Item label="收藏">
          { collectionList &&
            collectionList.data.map((item) => {
              return (
                <p>
                  <a href={item.detailLink} target="view_window">{item.name}</a>
                </p>
              )
            })
          }
        </Form.Item> */}
        <Form.Item label="最后登录时间">{moment(+detail.latesetTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
      </Form>
    );

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false} title={`${currName}的浏览历史(openId: ${currId})`} extra={<a href="javascript:;" onClick={() => history.goBack()}>返回</a>}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <Table columns={this.columns} dataSource={data.data} pagination={paginationProps} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserHistoryList;
