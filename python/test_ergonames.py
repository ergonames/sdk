from ergonames.ergonames import *

name = "~balb"
null_name = "~zack"
address = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL"
null_address = "3Wxf2LxF8HUSzfnT6bDGGUDNp1YMvWo5JWxjeSpszuV6w6UJGLSf"

def test_resolve_ergoname():
    assert resolve_ergoname(name) == address

def test_null_resolve_ergoname():
    assert resolve_ergoname(null_name) == None

def test_check_already_registered():
    assert check_already_registered(name) == True

def test_null_check_already_registered():
    assert check_already_registered(null_name) == False

def test_check_name_valid():
    assert check_name_valid(name) == True

def test_null_check_name_valid():
    assert check_name_valid(null_name) == True

def test_get_block_id_registered():
    assert get_block_id_registered(name) == "a5e0ab7f95142ceee7f3b6b5a5318153b345292e9aaae7c56825da115e196d08"

def test_null_get_block_id_registered():
    assert get_block_id_registered(null_name) == None

def test_get_block_registered():
    assert get_block_registered(name) == 60761

def test_null_get_block_registered():
    assert get_block_registered(null_name) == None

def test_get_timestamp_registered():
    assert get_timestamp_registered(name) == 1656968987794

def test_null_get_timestamp_registered():
    assert get_timestamp_registered(null_name) == None

def test_get_date_registered():
    assert get_date_registered(name) == "2022-07-04"
    
def test_null_get_date_registered():
    assert get_date_registered(null_name) == None

def test_reverse_search():
    assert reverse_search(address) == [{'tokenId': '2b41b93d22a46de0b0ed9c8b814b766298adbf2ff304f83ee2426f47ac33d9b8', 'amount': 1, 'decimals': 0, 'name': '~balb', 'tokenType': 'EIP-004'}]

def test_null_reverse_search():
    assert reverse_search(null_address) == []

def test_get_total_amount_owned():
    assert get_total_amount_owned(address) == 1

def test_null_get_total_amount_owned():
    assert get_total_amount_owned(null_address) == 0

if __name__ == "__main__":
    test_resolve_ergoname()
    print("resolve_ergoname() passed")
    test_null_resolve_ergoname()
    print("null_resolve_ergoname() passed")
    test_check_already_registered()
    print("check_already_registered() passed")
    test_null_check_already_registered()
    print("null_check_already_registered() passed")
    test_check_name_valid()
    print("check_name_valid() passed")
    test_null_check_name_valid()
    print("null_check_name_valid() passed")
    test_get_block_id_registered()
    print("get_block_id_registered() passed")
    test_null_get_block_id_registered()
    print("null_get_block_id_registered() passed")
    test_get_block_registered()
    print("get_block_registered() passed")
    test_null_get_block_registered()
    print("null_get_block_registered() passed")
    test_get_timestamp_registered()
    print("get_timestamp_registered() passed")
    test_null_get_timestamp_registered()
    print("null_get_timestamp_registered() passed")
    test_get_date_registered()
    print("get_date_registered() passed")
    test_null_get_date_registered()
    print("null_get_date_registered() passed")
    test_reverse_search()
    print("reverse_search() passed")
    test_null_reverse_search()
    print("null_reverse_search() passed")
    test_get_total_amount_owned()
    print("get_total_amount_owned() passed")
    test_null_get_total_amount_owned()
    print("null_get_total_amount_owned() passed")
    print("All tests passed")