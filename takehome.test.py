import sys
import os
import requests
import json
sys.path.append(os.getcwd())

# load url from json file
f = open("src/config.json")
data = json.load(f)
url = f"{data['url']}:{data['port']}"

# Request handlers
def clear():
    r = requests.delete(url + '/clear')
    if r.status_code == 400:
      raise Exception(r.json())
    return r.json()


def postTag(name):
    r = requests.post(url + '/tag', json={
        'name': name
    })
    if r.status_code == 400:
      raise Exception(r.json())
    return r.json()

def getTag(tagId):
    r = requests.get(url + '/tag', params={
        'tagId': tagId
    })
    if r.status_code == 400:
      raise Exception(r.json())
    return r.json()

def getTagList():
    r = requests.get(url + '/tag/list')
    if r.status_code == 400:
      raise Exception(r.json())
    return r.json()

def deleteTag(tagId):
    r = requests.delete(url + '/tag', params={
        'tagId': tagId
    })
    if r.status_code == 400:
        raise Exception(r.json())
    return r.json()

# Tests
def testClear():
    clear()

def testPostTag():
    clear()
    postTag('test')

def testGetTag():
    clear()
    tag = postTag('test')
    getTag(tag['tagId'])

def testGetTagList():
    clear()
    getTagList()

def testDeleteTag():
    clear()
    tag = postTag('test')
    deleteTag(tag['tagId'])

if __name__ == '__main__':
    tests = [testClear, testPostTag, testGetTag, testGetTagList, testDeleteTag]
    failed = 0
    for f in tests:
        try:
            f()
        except Exception as e:
            print(f'Failed: {f.__name__}')
            print(f'\t{e}')
            failed += 1
    print(f'You passed {len(tests) - failed} out of {len(tests)} tests.')

