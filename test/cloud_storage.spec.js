/*eslint no-unused-expressions:0 */
import {expect} from 'chai'
// import sinon from 'sinon'
import * as CloudStorage from '../app/helpers/cloud_storage'

describe('CloudStorage', function() {
  it('should equal when title/content/{platform_id}/update_on are the same', function() {
    let localPost = {
      id: 1,
      object_id: null,
      title: 'JavaScript',
      content: 'JavaScript is famous.',
      create_on: Date.now(),
      update_on: 1466734907559
    }
    let cloudPost = {
      object_id: 'xyz',
      title: 'JavaScript',
      content: 'JavaScript is famous.',
      update_on: 1466734907559
    }
    expect(CloudStorage.isEqual(localPost, cloudPost)).to.equal(true)
    localPost.zhihu_id = 1
    expect(CloudStorage.isEqual(localPost, cloudPost)).to.equal(false)
    delete localPost.zhihu_id
    expect(CloudStorage.isEqual(localPost, cloudPost)).to.equal(true)
  })

  it('should merge platform information', function() {
    let cloudPost = {
      zhihu_id: 1,
      jianshu_id: 2
    }
    let localPost = {
      github_id: 3,
      medium_id: 4
    }
    let merged = CloudStorage.mergePlatformInfo(cloudPost, localPost)
    expect(merged).to.deep.equal(Object.assign({}, cloudPost, localPost))
  })

  it('should using cloud post platform when id conflicts', function() {
    let cloudPost = {
      zhihu_id: 1,
      jianshu_id: 2
    }
    let localPost = {
      zhihu_id: 3,
      medium_id: 4
    }
    let merged = CloudStorage.mergePlatformInfo(cloudPost, localPost)
    expect(merged.zhihu_id).to.equal(1)
  })

  it('should contain required fields when inserting into cloud', function() {
    let localPost = {
      id: 1,
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: Date.now(),
      zhihu_id: 2,
      github_id: 3,
      jianshu_id: 4,
      medium_id: 5
    }
    let post = CloudStorage.getCloudUpsert(null, localPost)
    delete localPost.id
    expect(post).to.deep.equal(localPost)
  })

  it('should using local post data when updating cloud', function() {
    let localPost = {
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734907559,
      update_on: Date.now(),
      zhihu_id: 2,
      github_id: 3
    }
    let cloudPost = {
      id: 'xyz',
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: 1466734908559,
      jianshu_id: 4,
      medium_id: 5
    }
    let post = CloudStorage.getCloudUpsert(cloudPost, localPost)
    expect(post.id).to.equal(cloudPost.id)
    expect(post.title).to.equal(localPost.title)
    expect(post.content).to.equal(localPost.content)
    expect(post.create_on).to.equal(localPost.create_on)
    expect(post.update_on).to.equal(localPost.update_on)
    expect(post.zhihu_id).to.equal(localPost.zhihu_id)
    expect(post.github_id).to.equal(localPost.github_id)
    expect(post.jianshu_id).to.equal(cloudPost.jianshu_id)
    expect(post.medium_id).to.equal(cloudPost.medium_id)
  })

  it('should not contain content when there is no change in content field', function() {
    let localPost = {
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: Date.now(),
      zhihu_id: 2,
      github_id: 3
    }
    let cloudPost = {
      id: 'xyz',
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: 1466734908559,
      jianshu_id: 4,
      medium_id: 5
    }
    let post = CloudStorage.getCloudUpsert(cloudPost, localPost)
    expect(post.content).to.not.exist
  })

  it('should contain cloud object id when inserting into local', function() {
    let cloudPost = {
      id: 'xyz',
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: 1466734908559,
      jianshu_id: 4,
      medium_id: 5
    }
    let post = CloudStorage.getLocalInsert(cloudPost)
    expect(post.id).to.not.exist
    expect(post.object_id).to.exist
  })

  it('should override local data when platform info are the same', function() {
    let localPost = {
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734907559,
      update_on: 1466734907559,
      zhihu_id: 2,
      github_id: 3
    }
    let cloudPost = {
      id: 'xyz',
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: Date.now(),
      zhihu_id: 2,
      github_id: 3
    }
    let post = CloudStorage.getLocalUpdate(cloudPost, localPost)
    expect(post).to.deep.equal({
      id: 1,
      object_id: cloudPost.id,
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: cloudPost.update_on,
      zhihu_id: 2,
      github_id: 3
    })
    expect(CloudStorage.isEqual(cloudPost, post)).to.be.true
  })

  it('should use merge platform info when updating local post', function() {
    let localPost = {
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734907559,
      update_on: 1466734907559,
      zhihu_id: 2,
      github_id: 3
    }
    let cloudPost = {
      id: 'xyz',
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: Date.now(),
      zhihu_id: 21,
      jianshu_id: 4,
      medium_id: 5
    }
    let post = CloudStorage.getLocalUpdate(cloudPost, localPost)
    expect(post).to.deep.equal({
      id: 1,
      object_id: cloudPost.id,
      title: 'insert',
      content: 'insert into cloud',
      create_on: 1466734907559,
      update_on: cloudPost.update_on,
      zhihu_id: 21,
      jianshu_id: 4,
      medium_id: 5,
      github_id: 3
    })
    expect(CloudStorage.isEqual(cloudPost, post)).to.be.false
  })
})
