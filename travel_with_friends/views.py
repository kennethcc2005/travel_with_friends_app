# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# from snippets.models import Snippet
# from snippets.serializers import SnippetSerializer
from rest_framework import generics, status
from django.contrib.auth.models import User
from travel_with_friends.serializers import UserSerializer, FullTripSearchSerializer, OutsideTripSearchSerializer,CityStateSearchSerializer
from rest_framework import permissions
from travel_with_friends.permissions import IsOwnerOrReadOnly, IsStaffOrTargetUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import renderers
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.views import APIView
from city_trip import get_fulltrip_data
from helpers import *
from outside_trip import outside_trip_poi
from outside_helpers import *
from rest_framework.permissions import AllowAny
# from django.contrib.auth import get_user_model # If used custom user model
from django.views.decorators.csrf import csrf_exempt
'''
Get Token:
http post http://127.0.0.1:8000/account/get_auth_token/ username=test password=test1234

Get outside Trip:
http get 'http://127.0.0.1:8000/outside_trip_search/?city=San_Diego&state=California&direction=N&n_days=1'
'''
@api_view(['GET'])
def api_root(request, format=None):
    return Response({   
        'full-trips': reverse('full-trip-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format)
    })

@api_view(['POST'])
def create_auth(request):
    '''
    http post http://127.0.0.1:8000/account/register password=test1234 username=test3 email=''
    '''
    serialized = UserSerializer(data=request.data)
    permission_classes = [AllowAny]
    if serialized.is_valid():
        User.objects.create_user(
            email=serialized.data['email'], username=serialized.data['username'], password=serialized.data['password']
        )
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)

class FullTripSearch(APIView):
    def get_permissions(self):
        '''
        myurl = 'http://127.0.0.1:8000/full_trip_search/?state=California&city=San_Francisco&n_days=1'
        response = requests.get(myurl, headers={'Authorization': 'Token {}'.format(mytoken)})
        response.json()
        '''

        # return (permissions.IsAuthenticated()),
        return (AllowAny() if self.request.method == 'GET'
            else permissions.IsAuthenticated()),

    def get(self, request):
        # Validate the incoming input (provided through query parameters)
        serializer = FullTripSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        # Get the model input
        data = serializer.validated_data
        city = data["city"]
        state = data["state"]
        n_days = data["n_days"]
        state = abb_to_full_state(state)
        valid_state = check_valid_state(state)
        if not valid_state:
            return Response({
            "invalid state result": '%s is not a valid state name' %(state),
        })
        valid_city = check_valid_city(city, state)
        if not valid_city:
            return Response({
            "invalid city result": '%s is not valid city name for state %s' %(city, state),
        })
        full_trip_id, full_trip_details = get_fulltrip_data(state=state, city=city, n_days=n_days)
        print 'full deatils type: ', type(full_trip_details[0])
        return Response({
            "full_trip_id": full_trip_id,
            "full_trip_details": full_trip_details,
        })

class OutsideTripSearch(APIView):
    # def get_permissions(self):
    #     '''
    #     response = requests.get(myurl, headers={'Authorization': 'Token {}'.format(mytoken)})
    #     '''
    #     return (permissions.IsAuthenticated()),
        # return (AllowAny() if self.request.method == 'POST'
        #         else permissions.IsAuthenticated()),
    def get(self, request):
        # Validate the incoming input (provided through query parameters)
        serializer = OutsideTripSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        # Get the model input
        data = serializer.validated_data
        city = data["city"].replace('_',' ').title()
        state = data["state"].replace('_',' ').title()
        n_days = int(data["n_days"])
        direction = data["direction"].upper()
        valid_state = check_valid_state(state)
        if not valid_state:
            return Response({
            "invalid state result": '%s is not a valid state name' %(state),
        })
        valid_city = check_valid_city(city, state)
        if not valid_city:
            return Response({
            "invalid city result": '%s is not valid city name for state %s' %(city, state),
        })
        outside_trip_id, details = outside_trip_poi(origin_city=city, origin_state=state, target_direction = direction, n_days = n_days, full_day = True, regular = True, debug = True, user_id = 'zoesh')
        return Response({
            "outside_trip_id": outside_trip_id,
            "outside_trip_details": details,
        })

class CityStateSearch(APIView):
    # def get_permissions(self):
    #     '''
    #     response = requests.get(myurl, headers={'Authorization': 'Token {}'.format(mytoken)})
    #     '''
    #     return (permissions.IsAuthenticated()),
        # return (AllowAny() if self.request.method == 'POST'
        #         else permissions.IsAuthenticated()),
    def get(self, request):
        # Validate the incoming input (provided through query parameters)
        serializer = CityStateSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        # Get the model input
        data = serializer.validated_data
        city_state = data["city_state"]
        city_state = serach_city_state(city_state)
        city = [i[0] for i in city_state]
        state = [i[1] for i in city_state]
        city_and_state = [i[-1] for i in city_state]

        return Response({
            "city_state": city_and_state,
            "city": city,
            "state": state
        })

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


# class UserView(viewsets.ModelViewSet):
#     serializer_class = UserSerializer
#     model = User    
#     def get_permissions(self):
#         # allow non-authenticated user to create via POST
#         return (AllowAny() if self.request.method == 'POST'
#                 else IsStaffOrTargetUser()),


# @api_view(['POST'])
# @csrf_exempt
# class CreateUserView(generics.CreateAPIView):

#     model = User
#     permission_classes = [
#         AllowAny # Or anon users can't register
#     ]
#     serializer_class = UserSerializer