name := "ergonames"
organization := "ergonames"
version := "0.4.1"
scalaVersion := "2.13.8"

libraryDependencies +=  "org.scalaj" %% "scalaj-http" % "2.4.2"
libraryDependencies += "io.spray" %%  "spray-json" % "1.3.6"
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.11" % Test

githubOwner := "ergonames"
githubRepository := "ergo-names-scala-sdk"
githubTokenSource := TokenSource.GitConfig("github.token")
