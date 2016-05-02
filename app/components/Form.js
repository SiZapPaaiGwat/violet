import React, {PropTypes} from 'react'
import {Form, Input, Button} from 'antd'

const FormItem = Form.Item

let AccountPasswordForm = React.createClass({
  propTypes: {
    handleSubmit: PropTypes.func,
    form: PropTypes.any
  },

  handleSubmit(e) {
    e.preventDefault()
    this.props.handleSubmit(e, this.props.form.getFieldsValue())
  },

  render() {
    const {getFieldProps} = this.props.form
    return (
      <Form vertical onSubmit={this.handleSubmit}>
        <FormItem
          label="登录帐号"
        >
          <Input
            placeholder="请输入平台登录帐号"
            {...getFieldProps('userName')}
          />
        </FormItem>
        <FormItem
          label="密码"
        >
          <Input type="password" placeholder="请输入密码"
            {...getFieldProps('password')}
          />
        </FormItem>
        <Button type="ghost" htmlType="submit">立即保存</Button>
      </Form>
    )
  }
})

export default Form.create()(AccountPasswordForm)
