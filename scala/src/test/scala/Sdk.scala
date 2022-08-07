import ergonames.Sdk.ErgoNamesSdk._
import org.scalatest.funsuite.AnyFunSuite
import ergonames.Sdk.BalanceToken


class ErgoNamesSdkTest extends AnyFunSuite {

    val name = "~balb"
    val null_name = "~zack"
    val address = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL"
    val null_address = "3Wxf2LxF8HUSzfnT6bDGGUDNp1YMvWo5JWxjeSpszuV6w6UJGLSf"

    test("TestResolveErgoname") {
        assert(resolveErgoname(name).get === "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL")
    }

    test("NullResolveErgoname") {
        assert(resolveErgoname(null_name) === None)
    }

    test("TestCheckNameValid") {
        assert(check_name_valid(name) === true)
    }

    test("NullCheckNameValid") {
        assert(check_name_valid(null_name) === true)
    }

    test("TestCheckAlreadyRegistered") {
        assert(check_already_registered(name) === true)
    }

    test("NullCheckAlreadyRegistered") {
        assert(check_already_registered(null_name) === false)
    }

    test("TestCheckNamePrice") {
        assert(check_name_price(name) === 0)
    }

    test("NullCheckNamePrice") {
        assert(check_name_price(null_name) === 0)
    }

    test("TestGetBlockIdRegistered") {
        assert(get_block_id_registered(name).get === "a5e0ab7f95142ceee7f3b6b5a5318153b345292e9aaae7c56825da115e196d08")
    }

    test("NullGetBlockIdRegistered") {
        assert(get_block_id_registered(null_name) === None)
    }

    test("TestGetBlockRegistered") {
        assert(get_block_registered(name).get === 60761)
    }

    test("NullGetBlockRegistered") {
        assert(get_block_registered(null_name) === None)
    }

    test("TestGetTimeStampRegistered") {
        assert(get_timestamp_registered(name).get === 1656968987794L)
    }

    test("NullGetTimeStampRegistered") {
        assert(get_timestamp_registered(null_name) === None)
    }

    test("TestDateRegistered") {
        assert(get_date_registered(name).get === "07/04/2022")
    }

    test("NullDateRegistered") {
        assert(get_date_registered(null_name) === None)
    }

    test("TestTotalAmountOwned") {
        assert(get_total_amount_owned(address).get === 1)
    }

    test("NullTotalAmountOwned") {
        assert(get_total_amount_owned(null_address) === None)
    }

    test("TestReverseSearch") {
        val tk = BalanceToken("2b41b93d22a46de0b0ed9c8b814b766298adbf2ff304f83ee2426f47ac33d9b8", 1, "~balb")
        val arr = Array(tk)
        assert(reverse_search(address).get === arr)
    }

    test("NullReverseSearch") {
        assert(reverse_search(null_address) === None)
    }

}