/*eslint no-unused-expressions:0 no-param-reassign:0*/
import {expect} from 'chai'
// import sinon from 'sinon'
import * as CloudStorage from '../app/helpers/cloud_storage'

describe('CloudStorage', function() {
  it('should equal when local post and cloud post\'s main fields are identical', function() {
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

  it('should merge platform info when no intersection', function() {
    let cloudPost = {
      zhihu_id: 1,
      jianshu_id: 2
    }
    let localPost = {
      github_id: 3,
      medium_id: 4
    }
    let merged = CloudStorage.mergePlatformInfo(cloudPost, localPost)
    expect(merged).to.deep.equal({
      zhihu_id: 1,
      jianshu_id: 2,
      github_id: 3,
      medium_id: 4
    })
  })

  it('should merge platform info based on update time when intersects', function() {
    let cloudPost = {
      update_on: 100,
      zhihu_id: 1,
      jianshu_id: 2
    }
    let localPost = {
      update_on: 110,
      zhihu_id: 2,
      github_id: 3,
      medium_id: 4
    }
    let merged = CloudStorage.mergePlatformInfo(cloudPost, localPost)
    expect(merged).to.deep.equal({
      zhihu_id: 2,
      jianshu_id: 2,
      github_id: 3,
      medium_id: 4
    })
  })

  it('should contain all local post\'s fields when inserting to cloud', function() {
    let localPost = {
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
      update_on: 1466734907559,
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
    let post = CloudStorage.getLocalUpsert(cloudPost)
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
    let post = CloudStorage.getLocalUpsert(cloudPost, localPost)
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
    let post = CloudStorage.getLocalUpsert(cloudPost, localPost)
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

  it('should get empty array when comparing nothing', function() {
    let result = CloudStorage.compare()
    expect(result.cloud).to.be.empty
    expect(result.local.insert).to.be.empty
    expect(result.local.update).to.be.empty
    expect(result.local.remove).to.be.empty
  })

  it('should get empty array when two clients are the same', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734907559,
        update_on: 1466734907559
      }
    ]
    let localPosts = [
      {
        id: 1,
        object_id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734907559,
        update_on: 1466734907559
      }
    ]
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud).to.be.empty
    expect(result.local.insert).to.be.empty
    expect(result.local.update).to.be.empty
    expect(result.local.remove).to.be.empty
  })

  it('should get an insert post when cloud do not own this post', function() {
    let cloudPosts = []
    let localPosts = [
      {
        id: 1,
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734907559,
        update_on: 1466734907559
      }
    ]
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud.length).to.equal(1)
    expect(result.cloud[0]).to.deep.equal({
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734907559,
      update_on: 1466734907559
    })
    expect(result.local.insert).to.be.empty
    expect(result.local.update).to.be.empty
    expect(result.local.remove).to.be.empty
  })

  it('should get an update doc when two posts are not the same', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734906559,
        update_on: 1466734907559
      }
    ]
    // 本地较旧
    let localPosts = [
      {
        id: 1,
        object_id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734906559,
        update_on: 1466734906559
      }
    ]
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud).to.be.empty
    expect(result.local.insert).to.be.empty
    expect(result.local.update.length).to.equal(1)
    expect(result.local.remove).to.be.empty
    // 本地较新
    localPosts[0].update_on = Date.now()
    result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud.length).to.equal(1)
    expect(result.local.insert).to.be.empty
    expect(result.local.update).to.be.empty
    expect(result.local.remove).to.be.empty
  })

  it('should update cloud platform info even cloud post is the newest', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734906559,
        update_on: 1466734907559,
        zhihu_id: 2,
        jianshu_id: 3
      }
    ]
    // 本地较旧
    let localPosts = [
      {
        id: 1,
        object_id: 'xyz',
        title: 'insert',
        content: 'insert into cloud',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 1,
        medium_id: 4
      }
    ]
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud.length).to.equal(1)
    expect(result.local.insert).to.be.empty
    expect(result.local.update.length).to.equal(1)
    expect(result.local.remove).to.be.empty
    let cloud = result.cloud[0]
    let local = result.local.update[0]
    expect(cloud).to.deep.equal({
      id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734906559,
      update_on: 1466734907559,
      zhihu_id: 2,
      jianshu_id: 3,
      medium_id: 4
    })
    expect(local).to.deep.equal({
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734906559,
      update_on: 1466734907559,
      zhihu_id: 2,
      jianshu_id: 3,
      medium_id: 4
    })
  })

  it('should update local platform info even local post is the newest', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert',
        content: 'insert into cloud',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 2,
        jianshu_id: 3
      }
    ]
    // 本地较新
    let localPosts = [
      {
        id: 1,
        object_id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734906559,
        update_on: 1466734907559,
        zhihu_id: 1,
        medium_id: 4
      }
    ]
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud.length).to.equal(1)
    expect(result.local.insert).to.be.empty
    expect(result.local.update.length).to.equal(1)
    expect(result.local.remove).to.be.empty
    let cloud = result.cloud[0]
    let local = result.local.update[0]
    expect(cloud).to.deep.equal({
      id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734906559,
      update_on: 1466734907559,
      zhihu_id: 1,
      jianshu_id: 3,
      medium_id: 4
    })
    expect(local).to.deep.equal({
      id: 1,
      object_id: 'xyz',
      title: 'insert2',
      content: 'insert into cloud2',
      create_on: 1466734906559,
      update_on: 1466734907559,
      zhihu_id: 1,
      jianshu_id: 3,
      medium_id: 4
    })
  })

  it('should insert into local when cloud post not found', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert',
        content: 'insert into cloud',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 2,
        jianshu_id: 3
      }
    ]
    let localPosts = []
    let result = CloudStorage.compare(cloudPosts, localPosts)
    expect(result.cloud.length).to.equal(0)
    expect(result.local.insert.length).to.equal(1)
    expect(result.local.update).to.be.empty
    expect(result.local.remove).to.be.empty
  })

  it('should update local post insert to cloud and get local outdated post removed', function() {
    let cloudPosts = [
      {
        id: 'xyz',
        title: 'insert',
        content: 'insert into cloud',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 2,
        jianshu_id: 3
      }
    ]
    let localPosts = [
      {
        id: 1,
        object_id: 'deleted',
        title: 'insert1',
        content: 'insert into cloud1',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 2,
        jianshu_id: 3
      },
      {
        id: 2,
        object_id: 'xyz',
        title: 'insert2',
        content: 'insert into cloud2',
        create_on: 1466734906559,
        update_on: 1466734907559,
        zhihu_id: 2,
        jianshu_id: 3
      }, {
        id: 3,
        title: 'insert3',
        content: 'insert into cloud3',
        create_on: 1466734906559,
        update_on: 1466734906559,
        zhihu_id: 2,
        jianshu_id: 3
      }
    ]
    let {cloud, local, indexes} = CloudStorage.compare(cloudPosts, localPosts)
    let {insert, update, remove} = local
    expect(cloud.length).to.equal(2)
    expect(insert).to.be.empty
    expect(update).to.be.empty
    expect(remove.length).to.equal(1)
    expect(indexes).to.deep.equal({
      1: 3
    })
  })

  it('should purify cloud post', function() {
    let cloudPosts = [
      {
        id: 1,
        title: 'post 1',
        content: 'post 1 content',
        zhihu_id: 100
      },
      {
        id: 2,
        title: 'post 1',
        content: 'post 1 content',
        github_id: undefined
      }
    ]
    cloudPosts.forEach(item => {
      item.get = function(key) {
        return item[key]
      }
    })
    let posts = cloudPosts.map(CloudStorage.purify)
    expect(posts[0].zhihu_id).to.equal(100)
    expect(posts[1].github_id).to.not.exist
  })
})
