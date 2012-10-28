///<reference path='../../../../../../test/lib/YUITest.d.ts'/>

///<reference path='../../../../../../src/org/puremvc/typescript/interfaces/IModel.ts'/>

///<reference path='../../../../../../src/org/puremvc/typescript/core/Model.ts'/>
///<reference path='../../../../../../src/org/puremvc/typescript/patterns/observer/Notification.ts'/>
///<reference path='../../../../../../src/org/puremvc/typescript/patterns/proxy/Proxy.ts'/>

///<reference path='ModelTestProxy.ts'/>

module puremvc
{
	"use strict";

	import YUITest = module("YUITest");

	/**
	 * Test the PureMVC Model class.
	 */
	export class ModelTest
	{
		/**
		 * The name of the test case - if not provided, one is automatically generated by the
		 * YUITest framework.
		 */
		name:string = "PureMVC Model class tests";

		/**
		 * Tests the Model Singleton Factory Method.
		 */
		testGetInstance():void
		{
			// Test Factory Method
			var model:IModel = Model.getInstance()

			// test assertions
			YUITest.Assert.isNotNull
			(
				model,
				"Expecting instance !== null"
			);

			YUITest.Assert.isInstanceOf
			(
				Model,
				model,
				"Expecting instance extends Model"
			);
		}

		/**
		 * Tests the proxy registration and retrieval methods.
		 *
		 * Tests <code>registerProxy</code> and <code>retrieveProxy</code> in
		 * the same test. These methods cannot currently be tested separately
		 * in any meaningful way other than to show that the methods do not
		 * throw exception when called.
		 */
		testRegisterAndRetrieveProxy():void
		{
			// register a proxy and retrieve it.
			var model:IModel = Model.getInstance();
			model.registerProxy( new Proxy( 'colors', ['red', 'green', 'blue'] ) );

			var proxy:IProxy = model.retrieveProxy('colors');
			var data:string[] = <string[]> proxy.getData();

			// test assertions
			YUITest.Assert.isNotNull
			(
				data,
				"Expecting data !== null"
			);

			YUITest.Assert.isArray
			(
				data,
				"Expecting data type is Array"
			);

			YUITest.Assert.areEqual
			(
				3,
				data.length,
				"Expecting data.length == 3"
			);

			YUITest.Assert.areEqual
			(
				'red',
				data[0],
				"Expecting data[0] == 'red'"
			);

			YUITest.Assert.areEqual
			(
				'green',
				data[1],
				"Expecting data[1] == 'green'"
			);

			YUITest.Assert.areEqual
			(
				'blue',
				data[2],
				"Expecting data[2] == 'blue'"
			);
		}

		/**
		 * Tests the proxy removal method.
		 */
		testRegisterAndRemoveProxy():void
		{
			// register a proxy, remove it, then try to retrieve it
			var model:IModel = Model.getInstance();
			var proxy:IProxy = new Proxy( 'sizes', ['7', '13', '21'] );
			model.registerProxy( proxy );

			// remove the proxy
			var removedProxy:IProxy = model.removeProxy( 'sizes' );

			// assert that we removed the appropriate proxy
			YUITest.Assert.areEqual
			(
				'sizes',
				removedProxy.getProxyName(),
				"Expecting removedProxy.getProxyName() == 'sizes'"
			);

			// ensure that the proxy is no longer retrievable from the model
			proxy = model.retrieveProxy( 'sizes' );

			// test assertions
			YUITest.Assert.isNull
			(
				proxy,
				"Expecting proxy === null"
			);
		}

		/**
		 * Tests the hasProxy Method.
		 */
		testHasProxy():void
		{
			// register a proxy
			var model:IModel = Model.getInstance();
			var proxy:IProxy = new Proxy( 'aces', [ 'clubs', 'spades', 'hearts', 'diamonds' ] );
			model.registerProxy( proxy );

			// assert that the model.hasProxy method returns true
			// for that proxy name
			YUITest.Assert.isTrue
			(
				model.hasProxy('aces'),
				"Expecting model.hasProxy('aces') === true"
			);

			// remove the proxy
			model.removeProxy('aces');

			// assert that the model.hasProxy method returns false
			// for that proxy name
			YUITest.Assert.isFalse
			(
				model.hasProxy('aces'),
				"Expecting model.hasProxy('aces') === false"
			);
		}

		/**
		 * Tests that the Model calls the onRegister and onRemove methods.
		 */
		testOnRegisterAndOnRemove():void
		{
			// Get the Singleton View instance
			var model:IModel = Model.getInstance();

			// Create and register the test mediator
			var proxy:IProxy = new ModelTestProxy();
			model.registerProxy( proxy );

			// assert that onRegister was called, and the proxy responded by setting its data accordingly
			YUITest.Assert.areEqual
			(
				ModelTestProxy.ON_REGISTER_CALLED,
				proxy.getData(),
				"Expecting proxy.getData() == ModelTestProxy.ON_REGISTER_CALLED"
			);

			// Remove the component
			model.removeProxy( ModelTestProxy.NAME );

			// assert that onRemove was called, and the proxy responded by setting its data accordingly
			YUITest.Assert.areEqual
			(
				ModelTestProxy.ON_REMOVE_CALLED,
				proxy.getData(),
				"Expecting proxy.getData() == ModelTestProxy.ON_REMOVE_CALLED"
			);
		}
	}
}