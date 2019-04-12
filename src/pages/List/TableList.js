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
  Table
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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
@connect(({ jobList, loading }) => ({
  jobList,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'positionId',
      width: 10
    },
    {
      title: '职位',
      dataIndex: 'name',
      width: 40
    },
    {
      title: '链接',
      dataIndex: 'detailLink',
    },
    {
      title: '薪资',
      dataIndex: 'salary',
    },
    {
      title: '城市',
      dataIndex: 'city',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: '工作经验',
      dataIndex: 'workYear',
    },
    {
      title: '学历',
      dataIndex: 'education',
    },
    {
      title: '公司',
      dataIndex: 'companyName',
    },
    {
      title: '融资',
      dataIndex: 'financeStage',
    },
    {
      title: '规模',
      dataIndex: 'companySize',
    },
    {
      title: '入库时间',
      dataIndex: 'createTime',
      render: (text) => moment(+text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '是否完整',
      dataIndex: 'isComplete',
      render: text => text === 0 ? '否' : '是',
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => {}}>操作</a>
    //       {/* <Divider type="vertical" />
    //       <a href="">订阅警报</a> */}
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/pageJobList',
      payload: {
        pageNo: 1,
        pageSize: 10
      }
    });
  }

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
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
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  changePage(current){
    const { dispatch } = this.props;
    const params = {
      pageNo: current,
      pageSize: this.state.pageSize,
    };
    dispatch({
      type: 'jobList/pageJobList',
      payload: params,
    })
  }


  changePageSize(pageSize,current){
    this.setState({
      pageSize: pageSize,
    });
    const { dispatch } = this.props;
    const params = {
      pageSize: pageSize,
    };
    dispatch({
      type: 'jobList/pageJobList',
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
            <FormItem label="关键词">
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="城市">
              {getFieldDecorator('city')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="广州">广州</Option>
                  <Option value="深圳">深圳</Option>
                  <Option value="杭州">杭州</Option>
                  <Option value="南京">南京</Option>
                  <Option value="成都">成都</Option>
                  <Option value="西安">西安</Option>
                  <Option value="武汉">武汉</Option>
                  <Option value="重庆">重庆</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工作经验">
              {getFieldDecorator('workYear')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">不限</Option>
                  <Option value="0">应届毕业生</Option>
                  <Option value="1">1-3年</Option>
                  <Option value="2">3-5年</Option>
                  <Option value="3">5-10年</Option>
                  <Option value="4">10年以上</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="公司名">
              {getFieldDecorator('company')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="公司融资">
              {getFieldDecorator('stage')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">未融资</Option>
                  <Option value="0">天使轮</Option>
                  <Option value="1">A轮</Option>
                  <Option value="2">B轮</Option>
                  <Option value="3">C轮</Option>
                  <Option value="4">D轮及以上</Option>
                  <Option value="5">上市公司</Option>
                  <Option value="6">不需要融资</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规模">
              {getFieldDecorator('size')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">少于15人</Option>
                  <Option value="1">15-50人</Option>
                  <Option value="2">50-150人</Option>
                  <Option value="3">150-500人</Option>
                  <Option value="4">500-2000人</Option>
                  <Option value="5">2000人以上</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="学历">
              {getFieldDecorator('education')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">不限</Option>
                  <Option value="0">大专</Option>
                  <Option value="1">本科</Option>
                  <Option value="2">硕士</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="信息是否完整">
              {getFieldDecorator('isCompelete')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">不完整</Option>
                  <Option value="1">完整</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
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
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      jobList: { data }
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

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

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false} title="职位列表">
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}> */}
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div> */}
            <Table columns={this.columns} dataSource={data.data} pagination={paginationProps} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
