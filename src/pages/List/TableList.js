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
// import { resolve } from 'dns';

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
    pageSize: 10,
    loading: false,
    visible: false,
    detail: {}
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
      render: (val) => (
        <span>
          {
            workYearArr.map(curr => {
              if (curr.value === val) {
                return curr.label
              }
            })
          }
        </span>
      )
    },
    // {
    //   title: '学历',
    //   dataIndex: 'education',
    // },
    // {
    //   title: '公司',
    //   dataIndex: 'companyName',
    // },
    // {
    //   title: '融资',
    //   dataIndex: 'financeStage',
    //   render: (val) => (
    //     <span>
    //       {
    //         financeStageArr.map(curr => {
    //           if (curr.value === val) {
    //             return curr.label
    //           }
    //         })
    //       }
    //     </span>
    //   )
    // },
    // {
    //   title: '规模',
    //   dataIndex: 'companySize',
    //   render: (val) => (
    //     <span>
    //       {
    //         companySizeArr.map(curr => {
    //           if (curr.value === val) {
    //             return curr.label
    //           }
    //         })
    //       }
    //     </span>
    //   )
    // },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) => moment(+text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '是否完整',
      dataIndex: 'isComplete',
      render: text => text === 0 ? '否' : '是',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => text === 1 ? '启用中' : '禁用中',
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.showModal(record)}>查看</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleDisabled(record._id, record.status)}>{record.status ? '禁用' : '启用'}</a>
          {record.isComplete ? '' : (
            <span>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.handleUpdateDetail(record._id)}>更新</a>
            </span>
          )}
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/pageJobList',
      payload: {
        pageNo: 1,
        pageSize: 10,
        query: {}
      }
    });
  }

  showModal = (record) => {
    this.setState({
      visible: true,
      detail: record
    });
    // console.log(record)
  };

  handleGetDetail = () => {
    console.log('handleGetDetail')
  }

  handleUpdateDetail = (id) => {
    const { dispatch } = this.props;
    new Promise((resolve) => {
      dispatch({
        type: 'jobList/updateJobDetail',
        payload: {
          resolve,
          id
        }
      });
    }).then((res) => {
      if (res.success) {
        notification.success({
          message: '操作成功',
        });
        const params = {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          query: this.state.formValues
        };
        dispatch({
          type: 'jobList/pageJobList',
          payload: params,
        })
      } else {
        notification.error({
          message: '操作失败',
        });
      }
    })
  }

  handleDisabled = (id, status) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    new Promise((resolve) => {
      dispatch({
        type: 'jobList/changeJobStatus',
        payload: {
          resolve,
          id,
          status
        }
      });
    }).then((res) => {
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
          type: 'jobList/pageJobList',
          payload: params,
        })
      } else {
        notification.error({
          message: '操作失败',
        });
      }
    })
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }, () => {
      const params = {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        query: this.state.formValues
      };
      dispatch({
        type: 'jobList/pageJobList',
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
      }, () => {
        const params = {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          query: this.state.formValues
        };
        dispatch({
          type: 'jobList/pageJobList',
          payload: params,
        })
      });
      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
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
      pageNo: this.state.pageNo,
      pageSize: pageSize,
      query: this.state.formValues
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
                  <Option value="1">1年以下</Option>
                  <Option value="2">1-3年</Option>
                  <Option value="3">3-5年</Option>
                  <Option value="4">5-10年</Option>
                  <Option value="5">10年以上</Option>
                  <Option value="6">经验不限</Option>
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
                  <Option value="-1">不限</Option>
                  <Option value="0">未融资</Option>
                  <Option value="1">天使轮</Option>
                  <Option value="2">A轮</Option>
                  <Option value="3">B轮</Option>
                  <Option value="4">C轮</Option>
                  <Option value="5">D轮及以上</Option>
                  <Option value="6">上市公司</Option>
                  <Option value="7">不需要融资</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规模">
              {getFieldDecorator('size')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">不限</Option>
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
            <FormItem label="月薪">
              {getFieldDecorator('salary')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">不限</Option>
                  <Option value="0">2k以下</Option>
                  <Option value="1">2-5k</Option>
                  <Option value="2">5-10k</Option>
                  <Option value="3">10-15k</Option>
                  <Option value="4">15-25k</Option>
                  <Option value="5">25-50k</Option>
                  <Option value="6">50k以上</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="信息是否完整">
              {getFieldDecorator('isComplete')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">不限</Option>
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
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
    const { jobList } = this.props;
    const { data } = jobList;
    const { selectedRows, visible, loading, detail } = this.state;
    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

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
        <Form.Item label="id">{detail.positionId}</Form.Item>
        <Form.Item label="职位">
          <a href={detail.detailLink} target="view_window">{detail.name}</a>
        </Form.Item>
        <Form.Item label="薪资">{detail.salary}</Form.Item>
        <Form.Item label="城市|地区">{detail.city} | {detail.area}</Form.Item>
        <Form.Item label="学历">{detail.education}</Form.Item>
        <Form.Item label="经验">
          {
            detail.workYear &&
            workYearArr.map(curr => {
              if (curr.value === detail.workYear) {
                return curr.label
              }
            })
          }
        </Form.Item>
        <Form.Item label="标签">
          { detail.industryLables &&
            detail.industryLables.map((item) => {
              return (<Tag color="cyan">{item}</Tag>)
            })
          }
        </Form.Item>
        <Form.Item label="公司">
          <a href={detail.companyUrl} target="view_window">{detail.companyName}</a>
        </Form.Item>
        <Form.Item label="地址">{detail.isComplete ? detail.workAddr : '待更新'}</Form.Item>
        <Form.Item label="融资">
          {
            detail.financeStage &&
            financeStageArr.map(curr => {
              if (curr.value === detail.financeStage) {
                return curr.label
              }
            })
          }
        </Form.Item>
        <Form.Item label="规模">
          {
            detail.companySize &&
            companySizeArr.map(curr => {
              if (curr.value === detail.companySize) {
                return curr.label
              }
            })
          }
        </Form.Item>
        <Form.Item label="公司标签">
          { detail.industryField &&
            detail.industryField.map((item) => {
              return (<Tag color="cyan">{item}</Tag>)
            })
          }
        </Form.Item>
        <Form.Item label="优势">{detail.positionAdvantage}</Form.Item>
        <Form.Item label="创建时间">{moment(+detail.createTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
        <Form.Item label="更新时间">{moment(+detail.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
        <Form.Item label="发布时间">{moment(+detail.formatTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
        <Form.Item label="状态">{detail.status ? '启用中' : '禁用中'}</Form.Item>
        <Form.Item label="详细信息">
          {
            detail.isComplete ?
            <div dangerouslySetInnerHTML={{__html: detail.jobDetail}}></div>
            : (
              <Button key="back" type="primary" onClick={() => this.handleUpdateDetail(detail._id)}>
                更新详细信息
              </Button>
            )
          }
        </Form.Item>
      </Form>
    );

    return (
      <PageHeaderWrapper title="查询表格">
        <Modal
          visible={visible}
          title="职位详情"
          onCancel={this.handleCancel}
          className={styles.modal}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              返回
            </Button>,
            <Button key="submit" type="danger" loading={loading} onClick={() => this.handleDisabled(detail._id, detail.status)}>
              {detail.status ? '禁用' : '启用'}
            </Button>,
          ]}
        >
          <Comment
            avatar={
              <Avatar
                src={detail.companyLogo}
                alt="Han Solo"
              />
            }
            content={detailDiv}
          />
        </Modal>
        <Card bordered={false} title="职位列表">
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
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
